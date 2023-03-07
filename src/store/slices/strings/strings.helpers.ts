import SQLiteWrapper from "../../../common/SQLWrapper";
import { database } from "../../../index";
import { find, forEach, isEmpty, map } from "lodash";
import { IString, IWordRoot } from "../../../types";
import { ETable } from "./strings.thunks";
import { createLatinSortKey, getIsHebrewText } from "../../../common/helpers";
import { ELanguage } from "../../../common/constants";

export async function queryList({
  search,
  limit,
  offset,
  appLanguage,
}: {
  search: string;
  limit: number;
  offset: number;
  appLanguage: ELanguage;
}) {
  const isHebrewSearch = getIsHebrewText(search);

  const listQueryFunction = isHebrewSearch
    ? queryHebrewList
    : queryOtherLanguageList;

  return await listQueryFunction({
    search,
    limit,
    offset,
    appLanguage,
  });
}

export async function queryCount() {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);

  const transaction = await sw.query(
    `SELECT count(*) FROM ${ETable.strings} as count`
  );

  return transaction.data[0]["count(*)"];
}

async function queryHebrewList({
  search,
  limit,
  offset,
}: {
  search: string;
  limit: number;
  offset: number;
}) {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);
  console.log("create tables");
  let strings = [];
  await sw.query(`DROP TABLE IF EXISTS stringList;`);
  await sw.query(`DROP TABLE IF EXISTS tempStringList;`);

  await sw.query(`
    CREATE TABLE IF NOT EXISTS stringList (
      id integer, 
      root text,
      words text,
      word text,
      r text,
      links text,
      sortKey text
    );
  `);

  await sw.query(`
    CREATE TABLE IF NOT EXISTS tempStringList (
      id integer, 
      root text,
      words text,
      word text,
      r text,
      links text,
      sortKey text
    );
  `);
  await sw.query(
    `CREATE INDEX IF NOT EXISTS stringListWordIndex ON stringList(word);`
  );
  await sw.query(
    `CREATE INDEX IF NOT EXISTS stringListSortKeyIndex ON stringList(sortKey);`
  );

  await sw.query(
    `CREATE INDEX IF NOT EXISTS tempStringListWordIndex ON tempStringList(word);`
  );
  await sw.query(
    `CREATE INDEX IF NOT EXISTS tempStringListSortKeyIndex ON tempStringList(sortKey);`
  );

  console.log("matchingRowsQuery");
  const matchingRowsQuery = await sw.query(
    `
      SELECT *
      FROM strings
      WHERE word = ?
      OR word LIKE ?
      ORDER BY sortKey ASC;
    `,
    [search, `${search}%`]
  );

  if (!isEmpty(matchingRowsQuery.data)) {
    const firstMatchingRowId = matchingRowsQuery.data[0]?.id;

    console.log("matchingRowIndexQuery");
    const matchingRowIndexQuery = await sw.query(
      `
    SELECT *, t.rowIndex
    FROM (
        SELECT id, sortKey, ROW_NUMBER() OVER(ORDER BY sortKey) rowIndex
        FROM strings
    ) t
    WHERE t.id = ?;
  `,
      [firstMatchingRowId]
    );

    const sliceStartFrom: number =
      matchingRowIndexQuery.data[0]?.rowIndex - 1 || 0;
    const sliceEndWith = await queryTableLength("strings");

    console.log("slicedStringsTable");
    // copy to temp sliced table
    const slicedStringsTable = await sw.query(
      `
    SELECT *
    FROM strings
    ORDER BY sortKey ASC
    LIMIT ?,?;
  `,
      [sliceStartFrom, sliceEndWith]
    );

    sw.insert("tempStringList", slicedStringsTable.data);

    const asyncQueries: AsyncQueryFunction[] = [];

    forEach(Array(search.length), async (_, index, collection) => {
      asyncQueries.push(async () => {
        const searchString = search.slice(0, collection.length - index);
        const { data } = await sw.query(
          `
            SELECT *
            FROM tempStringList
            WHERE word = ?
            OR word LIKE ?
            ORDER BY sortKey ASC;
          `,
          [searchString, `${searchString}%`]
        );

        await sw.insert("stringList", data);

        const selectedRowIds = map(data, ({ id }) => id);

        await sw.query(
          `
            DELETE FROM tempStringList WHERE id IN (?);
        `,
          selectedRowIds
        );
      });
    });

    await queryAll(asyncQueries);

    const stringListQuery = await sw.query(
      `
    SELECT *
    FROM stringList
    LIMIT ${offset}, ${limit}
    `
    );

    strings = stringListQuery?.data;
  }

  const times = await queryTimes();
  const timeRColumnLinks = map(times, "r");

  console.log("map strings");

  await sw.query(`DROP TABLE tempStringList`);

  return await Promise.all(
    map(strings, async (item: IString) => {
      const isVerb = item.r && timeRColumnLinks.includes(item.r);

      const result = await sw
        .table(ETable.roots)
        .where("root", `${item.root}`, "=", "AND")
        .where("links", `${item.links}`, "=")
        .select(null);

      return {
        ...item,
        translations: result?.data,
        time: isVerb && find(times, { r: item.r }),
      };
    })
  );
}

export async function queryOtherLanguageList({
  search,
  limit,
  offset,
  appLanguage,
}: {
  search: string;
  limit: number;
  offset: number;
  appLanguage: ELanguage;
}) {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);
  const lowerCaseSearch = search.toLowerCase();

  const sortKeyValue = createLatinSortKey(lowerCaseSearch);

  const { data: wordTranslations } = await sw.query(
    `
                        SELECT *
                        FROM roots
                        WHERE ${appLanguage}LowerCase = ?
                        OR ${appLanguage}LowerCase LIKE ?
                        OR ${appLanguage}LowerCase LIKE ?
                        ORDER BY ${appLanguage}LowerCase ASC
                        LIMIT ${offset}, ${limit}
                      `,
    [sortKeyValue, `${sortKeyValue}%`, `% ${sortKeyValue}%`]
  );

  const times = await queryTimes();
  const timeRColumnLinks = map(times, "r");

  return await Promise.all(
    map(wordTranslations, async (wordRoot: IWordRoot) => {
      const { data } = await sw
        .table(ETable.strings)
        .where("root", `${wordRoot.root}`, "=", "AND")
        .where("links", `${wordRoot.links}`, "=")
        .select(null);

      const strings = map(data, (str) => {
        const isVerb = str.r && timeRColumnLinks.includes(str.r);

        return {
          ...str,
          time: isVerb && find(times, { r: str.r }),
        };
      });

      return {
        ...wordRoot,
        strings,
      };
    })
  );
}

async function queryTimes() {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);
  const { data } = await sw.table(ETable.times).select(null);

  return data;
}

async function queryTableLength(tableName: string) {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);

  const tableLengthQuery = await sw.query(`
    SELECT COUNT(*) as length
    FROM ${tableName};
  `);

  return tableLengthQuery.data[0].length;
}

type AsyncQueryFunction = () => Promise<void>;

async function queryAll(
  asyncQueryFunctions: AsyncQueryFunction[]
): Promise<void> {
  for (const asyncFunction of asyncQueryFunctions) {
    await asyncFunction();
  }
}
