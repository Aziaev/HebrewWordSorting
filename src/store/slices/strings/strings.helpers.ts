import SQLiteWrapper from "../../../common/SQLWrapper";
import { database } from "../../../index";
import { concat, find, forEach, isEmpty, map, reduce } from "lodash";
import { IString, IWordRoot } from "../../../types";
import { ETable } from "./strings.thunks";
import { getIsHebrewText } from "../../../common/helpers";
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

export async function queryNextPage({
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
    ? queryHebrewNextPage
    : queryOtherLanguageList;

  return await listQueryFunction({
    search,
    limit,
    offset,
    appLanguage,
  });
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

  const matchingRowsQuery = await sw.query(
    `
      SELECT *
      FROM strings
      WHERE word = ?
      OR word LIKE ?
      ORDER BY sortKey ASC
      LIMIT 1;
    `,
    [search, `${search}%`]
  );

  if (!isEmpty(matchingRowsQuery.data)) {
    const firstMatchingRowId = matchingRowsQuery.data[0]?.id;
    const matchingRowIndexQuery = await sw.query(
      `
      SELECT *, t.rowIndex
      FROM (
          SELECT id, sortKey, ROW_NUMBER() OVER(ORDER BY sortKey) rowIndex
          FROM strings
      ) t
      WHERE t.id = ?
      LIMIT 1;
    `,
      [firstMatchingRowId]
    );
    const sliceStartFrom: number = matchingRowIndexQuery.data[0]?.rowIndex - 1;

    // copy to temp sliced table
    await sw.query(`
        INSERT INTO tempStringList
        SELECT *
        FROM strings
        ORDER BY sortKey ASC
        LIMIT -1 
        OFFSET ${sliceStartFrom};
    `);

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
        sw.table("tempStringList").whereIn("id", selectedRowIds).delete();
      });
    });

    await queryAll(asyncQueries);

    const stringListQuery = await sw.query(`
      SELECT *
      FROM stringList
      LIMIT ${offset}, ${limit}
    `);

    strings = stringListQuery?.data;
  }

  await sw.query(`DROP TABLE tempStringList`);

  const times = await queryTimes();
  const timeRColumnLinks = map(times, "r");

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

async function queryHebrewNextPage({
  limit,
  offset,
}: {
  search: string;
  limit: number;
  offset: number;
}) {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);
  const { data } = await sw.query(`
    SELECT *
    FROM stringList
    LIMIT ${offset}, ${limit}
  `);

  const times = await queryTimes();
  const timeRColumnLinks = map(times, "r");

  return await Promise.all(
    map(data, async (item: IString) => {
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
  console.log("creating tables");
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);
  let roots = [];
  await sw.query(`DROP TABLE IF EXISTS rootList;`);
  await sw.query(`DROP TABLE IF EXISTS tempRootList;`);

  const rootsTableSchema =
    "id integer, root text , links text , binyan text , ru text , ruLowerCase text , ua text , uaLowerCase text , en text , enLowerCase text , words1 text , words text";

  await sw.query(`CREATE TABLE IF NOT EXISTS rootList (${rootsTableSchema});`);
  await sw.query(
    `CREATE TABLE IF NOT EXISTS tempRootList (${rootsTableSchema});`
  );

  const lowerCaseSearch = search.toLowerCase();

  console.log("matchingRowsQuery");
  const matchingRowsQuery = await sw.query(
    `
      SELECT *
      FROM roots
      WHERE ${appLanguage}LowerCase = ?
      OR ${appLanguage}LowerCase LIKE ?
      OR ${appLanguage}LowerCase LIKE ?
      ORDER BY ${appLanguage}LowerCase ASC
      LIMIT 1
    `,
    [lowerCaseSearch, `${lowerCaseSearch}%`, `% ${lowerCaseSearch}%`]
  );

  if (!isEmpty(matchingRowsQuery.data)) {
    const firstMatchingRowId = matchingRowsQuery.data[0]?.id;
    console.log("matchingRowIndexQuery");
    const matchingRowIndexQuery = await sw.query(
      `
      SELECT *, t.rowIndex
      FROM (
          SELECT id, ${appLanguage}LowerCase, ROW_NUMBER() OVER(ORDER BY ${appLanguage}LowerCase) rowIndex
          FROM roots
      ) t
      WHERE t.id = ?
      LIMIT 1;
    `,
      [firstMatchingRowId]
    );
    const sliceStartFrom: number = matchingRowIndexQuery.data[0]?.rowIndex - 1;

    console.log("copy to temp sliced table");
    // copy to temp sliced table
    await sw.query(`
        INSERT INTO tempRootList
        SELECT *
        FROM roots
        ORDER BY ${appLanguage}LowerCase ASC
        LIMIT -1 
        OFFSET ${sliceStartFrom};
    `);

    const asyncQueries: AsyncQueryFunction[] = [];

    console.log("forEach asyncQueries");
    forEach(Array(lowerCaseSearch.length), async (_, index, collection) => {
      asyncQueries.push(async () => {
        const searchString = lowerCaseSearch.slice(
          0,
          collection.length - index
        );
        const { data } = await sw.query(
          `
            SELECT *
            FROM tempRootList
            WHERE ${appLanguage}LowerCase = ?
            OR ${appLanguage}LowerCase LIKE ?
            OR ${appLanguage}LowerCase LIKE ?
            ORDER BY ${appLanguage}LowerCase ASC;
          `,
          [searchString, `${searchString}%`, `% ${searchString}%`]
        );
        await sw.insert("rootList", data);
        const selectedRowIds = map(data, ({ id }) => id);
        sw.table("tempRootList").whereIn("id", selectedRowIds).delete();
      });
    });

    console.log("queryAll(asyncQueries)");

    await queryAll(asyncQueries);

    const rootListQuery = await sw.query(`
      SELECT *
      FROM rootList
      LIMIT ${offset}, ${limit}
    `);

    console.log("queryAll(asyncQueries)");
    roots = rootListQuery?.data;
  }

  await sw.query(`DROP TABLE tempRootList`);

  const times = await queryTimes();
  const timeRColumnLinks = map(times, "r");

  console.log("Promise.all");

  const mixedRootsStringsArray = await Promise.all(
    map(roots, async (wordRoot: IWordRoot) => {
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

  const flatArray: IWordRoot[] = reduce(
    mixedRootsStringsArray,
    (result, item) => {
      const innerArray = map(item.strings, (string: IString) => ({
        ...item,
        string,
        id: `${item.id}_${string.id}`,
      }));

      // @ts-expect-error
      return concat(result, innerArray);
    },
    [] as IWordRoot[]
  );

  return flatArray;
}

export async function queryCount() {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);

  const transaction = await sw.query(
    `SELECT count(*) FROM ${ETable.strings} as count`
  );

  return transaction.data[0]["count(*)"];
}

async function queryTimes() {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);
  const { data } = await sw.table(ETable.times).select(null);

  return data;
}

type AsyncQueryFunction = () => Promise<void>;

async function queryAll(
  asyncQueryFunctions: AsyncQueryFunction[]
): Promise<void> {
  for (const asyncFunction of asyncQueryFunctions) {
    await asyncFunction();
  }
}
