import SQLiteWrapper from "../../../common/SQLWrapper";
import { database } from "../../../index";
import {find, map} from "lodash";
import { IString } from "../../../types";
import { ETable } from "./strings.thunks";

export async function queryList({
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
  let strings = []
  try {
    const { data } = await sw
      .table(ETable.strings)
      .where("word", `${search}`, null)
      .where("word", `${search}%`, "LIKE", "OR")
      .orderBy("sortKey", "ASC")
      .select(null, limit, offset);

    strings = data
  } catch (e){
    console.log("query list error", e)
  }

  console.log(strings[0])

  const { data: times } = await sw.table(ETable.times).select(null);

  const list = await Promise.all(
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

  return list;
}

export async function queryCount() {
  // @ts-expect-error
  const sw = new SQLiteWrapper(database);

  const transaction = await sw.query(
    `SELECT count(*) FROM ${ETable.strings} as count`
  );

  return transaction.data[0]["count(*)"];
}
