import SQLiteWrapper from "../../../common/SQLWrapper";
import { database } from "../../../index";
import { concat, filter, find, forEach, isEmpty, map, reduce } from "lodash";
import { IString, IWordRoot } from "../../../types";
import { getIsHebrewText } from "../../../common/helpers";
import { ELanguage, ETable } from "../../../common/constants";

export async function queryList({
  search,
  limit,
  offset,
  language,
}: {
  search: string;
  limit: number;
  offset: number;
  language: ELanguage;
}) {
  const isHebrewSearch = getIsHebrewText(search);

  const listQueryFunction = isHebrewSearch
    ? queryHebrewList
    : queryOtherLanguageList;

  return await listQueryFunction({
    search,
    limit,
    offset,
    language,
  });
}

export async function queryNextPage({
  search,
  limit,
  offset,
}: {
  search: string;
  limit: number;
  offset: number;
}) {
  const isHebrewSearch = getIsHebrewText(search);

  const listQueryFunction = isHebrewSearch
    ? queryHebrewNextPage
    : queryOtherLanguageNextPage;

  return await listQueryFunction({
    limit,
    offset,
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

  let matchingRowsQuery;

  if (!search) {
    // copy to all to stringList
    await sw.query(`
        INSERT INTO stringList
        SELECT *
        FROM strings
        ORDER BY sortKey ASC;
    `);

    const stringListQuery = await sw.query(`
      SELECT *
      FROM stringList
      LIMIT ${offset}, ${limit}
    `);

    strings = stringListQuery?.data;
  } else {
    matchingRowsQuery = await sw.query(
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
  }

  if (!isEmpty(matchingRowsQuery?.data)) {
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
        if (index === 0) {
          const { data: fullMatchData } = await sw.query(
            `
            SELECT *
            FROM tempStringList
            WHERE word = ?
            ORDER BY sortKey ASC;
          `,
            [searchString]
          );
          const fullMatchRowIds = map(fullMatchData, ({ id }) => id);
          sw.table("tempStringList").whereIn("id", fullMatchRowIds).delete();

          const { data: likeMatchData } = await sw.query(
            `
            SELECT *
            FROM tempStringList
            WHERE word LIKE ?
            ORDER BY sortKey ASC;
          `,
            [`${searchString}%`]
          );
          const likeMatchDataRowIds = map(likeMatchData, ({ id }) => id);
          sw.table("tempStringList")
            .whereIn("id", likeMatchDataRowIds)
            .delete();
          const { data: inSentenceMatchData } = await sw.query(
            `
            SELECT *
            FROM tempStringList
            WHERE word LIKE ?
            ORDER BY sortKey ASC;
          `,
            [`% ${searchString}%`]
          );
          const inSentenseMatchDataRowIds = map(
            inSentenceMatchData,
            ({ id }) => id
          );
          sw.table("tempStringList")
            .whereIn("id", inSentenseMatchDataRowIds)
            .delete();

          await sw.insert("stringList", [
            ...fullMatchData,
            ...likeMatchData,
            ...inSentenceMatchData,
          ]);

          sw.table("tempStringList")
            .whereIn("id", [
              ...fullMatchRowIds,
              ...likeMatchDataRowIds,
              ...inSentenseMatchDataRowIds,
            ])
            .delete();
        } else {
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
        }
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
  language,
}: {
  search: string;
  limit: number;
  offset: number;
  language: ELanguage;
}) {
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

  let matchingRowsQuery;

  if (!lowerCaseSearch) {
    await sw.query(`
      INSERT INTO rootList
      SELECT *
      FROM roots
      ORDER BY ${language}LowerCase ASC;
    `);

    const rootListQuery = await sw.query(`
      SELECT *
      FROM rootList
      LIMIT ${offset}, ${limit}
    `);

    roots = rootListQuery?.data;
  } else {
    matchingRowsQuery = await sw.query(
      `
      SELECT *
      FROM roots
      WHERE ${language}LowerCase = ?
      OR ${language}LowerCase LIKE ?
      OR ${language}LowerCase LIKE ?
      ORDER BY ${language}LowerCase ASC
      LIMIT 1;
    `,
      [lowerCaseSearch, `${lowerCaseSearch}%`, `% ${lowerCaseSearch}%`]
    );
  }

  if (!isEmpty(matchingRowsQuery?.data)) {
    const firstMatchingRowId = matchingRowsQuery.data[0]?.id;
    const matchingRowIndexQuery = await sw.query(
      `
      SELECT *, t.rowIndex
      FROM (
          SELECT id, ${language}LowerCase, ROW_NUMBER() OVER(ORDER BY ${language}LowerCase) rowIndex
          FROM roots
      ) t
      WHERE t.id = ?
      LIMIT 1;
    `,
      [firstMatchingRowId]
    );
    const sliceStartFrom: number = matchingRowIndexQuery.data[0]?.rowIndex - 1;

    // copy to temp sliced table
    await sw.query(`
        INSERT INTO tempRootList
        SELECT *
        FROM roots
        ORDER BY ${language}LowerCase ASC
        LIMIT -1 
        OFFSET ${sliceStartFrom};
    `);

    const asyncQueries: AsyncQueryFunction[] = [];

    forEach(Array(lowerCaseSearch.length), async (_, index, collection) => {
      asyncQueries.push(async () => {
        const searchString = lowerCaseSearch.slice(
          0,
          collection.length - index
        );
        if (index === 0) {
          const { data: fullMatchData } = await sw.query(
            `
            SELECT *
            FROM tempRootList
            WHERE ${language}LowerCase = ?
            ORDER BY ${language}LowerCase ASC;
          `,
            [searchString]
          );
          const fullMatchRowIds = map(fullMatchData, ({ id }) => id);
          sw.table("tempRootList").whereIn("id", fullMatchRowIds).delete();

          // match as one of word in list as first
          const { data: firstInListData } = await sw.query(
            `
            SELECT *
            FROM tempRootList
            WHERE ${language}LowerCase LIKE ?
            ORDER BY ${language}LowerCase ASC;
          `,
            [`${searchString},%`]
          );
          const firstInListRowIds = map(firstInListData, ({ id }) => id);
          sw.table("tempRootList").whereIn("id", firstInListRowIds).delete();

          // match as one of word in list
          const { data: oneOfListData } = await sw.query(
            `
            SELECT *
            FROM tempRootList
            WHERE ${language}LowerCase LIKE ?
            OR ${language}LowerCase LIKE ?
            OR ${language}LowerCase LIKE ?
            OR ${language}LowerCase LIKE ?
            ORDER BY ${language}LowerCase ASC;
          `,
            [
              `%, ${searchString},%`,
              `%,${searchString},%`,
              `%, ${searchString}`,
              `%,${searchString}`,
            ]
          );
          const oneOfListRowIds = map(oneOfListData, ({ id }) => id);
          sw.table("tempRootList").whereIn("id", oneOfListRowIds).delete();

          const { data: likeMatchData } = await sw.query(
            `
            SELECT *
            FROM tempRootList
            WHERE ${language}LowerCase LIKE ?
            ORDER BY ${language}LowerCase ASC;
          `,
            [`${searchString}%`]
          );
          const likeMatchDataRowIds = map(likeMatchData, ({ id }) => id);
          sw.table("tempRootList").whereIn("id", likeMatchDataRowIds).delete();

          const { data: inSentenceMatchData } = await sw.query(
            `
            SELECT *
            FROM tempRootList
            WHERE ${language}LowerCase LIKE ?
            ORDER BY ${language}LowerCase ASC;
          `,
            [`% ${searchString}%`]
          );
          const inSentenseMatchDataRowIds = map(
            inSentenceMatchData,
            ({ id }) => id
          );
          sw.table("tempRootList")
            .whereIn("id", inSentenseMatchDataRowIds)
            .delete();

          await sw.insert("rootList", [
            ...fullMatchData,
            ...firstInListData,
            ...oneOfListData,
            ...likeMatchData,
            ...inSentenceMatchData,
          ]);
        } else {
          const { data } = await sw.query(
            `
            SELECT *
            FROM tempRootList
            WHERE ${language}LowerCase = ?
            OR ${language}LowerCase LIKE ?
            OR ${language}LowerCase LIKE ?
            ORDER BY ${language}LowerCase ASC;
          `,
            [searchString, `${searchString}%`, `% ${searchString}%`]
          );
          await sw.insert("rootList", data);
          const selectedRowIds = map(data, ({ id }) => id);
          sw.table("tempRootList").whereIn("id", selectedRowIds).delete();
        }
      });
    });

    await queryAll(asyncQueries);

    const rootListQuery = await sw.query(`
      SELECT *
      FROM rootList
      LIMIT ${offset}, ${limit}
    `);

    roots = rootListQuery?.data;
  }

  await sw.query(`DROP TABLE tempRootList`);

  const mixedRootsStringsArray = await Promise.all(
    map(roots, async (wordRoot: IWordRoot) => {
      const { data } = await sw
        .table(ETable.strings)
        .where("root", `${wordRoot.root}`, "=", "AND")
        .where("links", `${wordRoot.links}`, "=")
        .select(null);

      const strings = filter(data, (str) => {
        return !str.r || str.r === "a";
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

export async function queryOtherLanguageNextPage({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);
  const { data } = await sw.query(`
    SELECT *
    FROM rootList
    LIMIT ${offset}, ${limit}
  `);

  const mixedRootsStringsArray = await Promise.all(
    map(data, async (wordRoot: IWordRoot) => {
      const { data } = await sw
        .table(ETable.strings)
        .where("root", `${wordRoot.root}`, "=", "AND")
        .where("links", `${wordRoot.links}`, "=")
        .select(null);

      const strings = filter(data, (str) => {
        return !str.r || str.r === "a";
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

export async function queryTableCount(tableName: ETable) {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);

  const transaction = await sw.query(
    `SELECT count(*) FROM ${tableName} as count`
  );

  return transaction.data[0]["count(*)"];
}

export async function queryTimes() {
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
