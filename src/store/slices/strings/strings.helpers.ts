import SQLiteWrapper from "../../../common/SQLWrapper";
import { database } from "../../../index";
import { find, map } from "lodash";
import { IString } from "../../../types";
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
  let strings = [];

  const query = await sw.query(
    `
                        SELECT *
                        FROM strings
                        WHERE word = ?
                        OR word LIKE ?
                        ORDER BY sortKey ASC
                        LIMIT ${offset}, ${limit}
                      `,
    [search, `${search}%`]
  );

  strings = query?.data;

  const times = await queryTimes();

  return await Promise.all(
    map(strings, async (item: IString) => {
      const timeRColumnLinks = map(times, "r");
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
  const { data: wordTranslations } = await sw.query(
    `
                        SELECT *
                        FROM roots
                        WHERE ${appLanguage} = ?
                        OR ${appLanguage} LIKE ?
                        ORDER BY LOWER(${appLanguage}) ASC
                        LIMIT ${offset}, ${limit}
                      `,
    [search, `${search}%`]
  );

  const times = await queryTimes();

  return await Promise.all(
    map(wordTranslations, async (item: IString) => {
      const timeRColumnLinks = map(times, "r");
      const isVerb = item.r && timeRColumnLinks.includes(item.r);

      const { data } = await sw
        .table(ETable.strings)
        .where("root", `${item.root}`, "=", "AND")
        .where("links", `${item.links}`, "=")
        .select(null);

      const strings = map(data, (str) => ({
        ...str,
        time: isVerb && find(times, { r: str.r }),
      }));

      return {
        ...item,
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
