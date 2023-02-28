import { createAsyncThunk } from "@reduxjs/toolkit";
import * as SQLite from "expo-sqlite";
import { SQLTransaction } from "expo-sqlite";
// @ts-expect-error
import SQLiteWrapper from "sqlite-js-wrapper";
import { RootState } from "../../index";

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
    const db = SQLite.openDatabase(dbName);
    const sw = new SQLiteWrapper(db);

    // const { data } = await sw
    //   .table(ETable.strings)
    //   .where("word", `${search}%`, "LIKE")
    //   .orderBy("word", "ASC")
    //   .select(null, limit, offset);

    const { data } = await sw.table(ETable.nikud).select(null, limit, offset);

    return { list: data, limit, offset };
  }
);

export const fetchNextPage = createAsyncThunk(
  "strings/fetchNextPage",
  async (_, { getState }: { getState: () => unknown }) => {
    const state = getState() as RootState;
    const { limit, offset, search } = state.strings;
    const db = SQLite.openDatabase(dbName);
    const sw = new SQLiteWrapper(db);

    const transaction = await sw.query(
      `SELECT count(*) FROM ${ETable.strings} as count`
    );
    const count = transaction.data[0]["count(*)"];

    if (offset / limit < count / limit) {
      const newOffset = offset + limit;
      const { data } = await sw
        .table(ETable.strings)
        .where("word", `${search}%`, "LIKE")
        .orderBy("word", "ASC")
        .select(null, limit, newOffset);

      return { list: data, limit, offset: newOffset };
    }

    return { list: [], limit, offset };
  }
);

// SELECT (*) FROM strings WHERE word LIKE A% LIMIT 30 OFFSET 0 AND ...
