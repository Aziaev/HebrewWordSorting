import SQLiteWrapper from "../../../common/SQLWrapper";
import { database } from "../../../index";
import { ETable } from "../../../common/constants";
import { find, map } from "lodash";
import { IString } from "../../../types";
import { queryTimes } from "../strings/strings.helpers";

export async function queryMatchingHebrewWords(search: string) {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);
  const { data } = await sw.query(
    `
            SELECT *
            FROM ${ETable.strings}
            WHERE word = ?
            ORDER BY sortKey ASC;
          `,
    [search]
  );

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

export async function queryBinyans(selected: IString) {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);

  const query = await sw.query(
    `
            SELECT *
            FROM ${ETable.verbs}
            WHERE base = ?
            AND r = ?
            ORDER BY r ASC;
          `,
    [selected.root, "1"]
  );

  return query.data[0];
}

export async function queryRoots(selected: IString) {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);

  const result = await sw
    .table(ETable.roots)
    .where("root", `${selected.root}`, "=", "AND")
    .where("links", `${selected.links}`, "=")
    .select(null);

  return result.data;
}

export async function queryVerbInfinitive(selected: IString, binyan: string) {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);

  const query = await sw.query(
    `
            SELECT *
            FROM ${ETable.verbs}
            WHERE base = ?
            AND r = ?
            ORDER BY r ASC;
          `,
    [selected.root, "i"]
  );

  return query.data[0];
}

export async function queryInfinitiveTranslations({
  root,
  binyan,
}: {
  root: string;
  binyan: string;
}) {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);

  const query = await sw
    .table(ETable.roots)
    .where("root", `${root}`, "=", "AND")
    .where("binyan", `${binyan}`, "=")
    .select(null);

  return query.data;
}

export async function queryVerbs(root: string) {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);

  const { data } = await sw.query(
    `
            SELECT *
            FROM ${ETable.verbs}
            WHERE base = ?
            ORDER BY r ASC;
          `,
    [root]
  );

  return data;
}
