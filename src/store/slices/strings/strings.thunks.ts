import { createAsyncThunk } from "@reduxjs/toolkit";
// @ts-expect-error
import SQLiteWrapper from "sqlite-js-wrapper";
import { RootState } from "../../";
import { database } from "../../../";
import { find, map, reduce } from "lodash";
import { IString } from "../../../types";

export const dbName = "HebrewWordSorting";

export enum ETable {
  strings = "strings",
  roots = "roots",
  times = "times",
  verbs = "verbs",
  nikud = "nikud",
}

export const searchByString = createAsyncThunk(
  "strings/searchByString",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { limit, offset, search } = state.strings;

    const list = await fetchList({
      search,
      limit,
      offset,
    });

    return { list, limit, offset };
  }
);

export const fetchNextPage = createAsyncThunk(
  "strings/fetchNextPage",
  async (_, { getState }: { getState: () => unknown }) => {
    const state = getState() as RootState;
    const { limit, offset, search } = state.strings;
    const sw = new SQLiteWrapper(database);

    const transaction = await sw.query(
      `SELECT count(*) FROM ${ETable.strings} as count`
    );
    const count = transaction.data[0]["count(*)"];

    if (search && offset / limit < count / limit) {
      const newOffset = offset + limit;
      const list = await fetchList({
        search,
        limit,
        offset: newOffset,
      });

      return { list, limit, offset: newOffset };
    }

    return { list: [], limit, offset };
  }
);

async function fetchList({
  search,
  limit,
  offset,
}: {
  search: string;
  limit: number;
  offset: number;
}) {
  const sw = new SQLiteWrapper(database);
  const { data } = await sw
    .table(ETable.strings)
    .where("word", `${search}%%`, "LIKE")
    .orderBy("word", "ASC")
    .select(null, limit, offset);

  const list = await Promise.all(
    map(data, async (item: IString) => {
      const { data: times } = await sw.table(ETable.times).select(null);
      const timeRColumnLinks = map(times, "r");
      const isVerb = item.r && timeRColumnLinks.includes(item.r);

      const result = await sw
        .table(ETable.roots)
        .where("root", `${item.root}`, "=", "AND")
        .where("links", `${item.links}`, "=")
        .select(null);

      console.log(result?.data.length);

      return {
        ...item,
        translations: result?.data,
        time: isVerb && find(times, { r: item.r }),
      };
    })
  );

  return list;
}
