import { createAsyncThunk } from "@reduxjs/toolkit";
import * as SQLite from "expo-sqlite";
// @ts-expect-error
import SQLiteWrapper from "sqlite-js-wrapper";

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
  async ({ search }: { search: string }) => {
    const db = SQLite.openDatabase(dbName);
    const sw = new SQLiteWrapper(db);

    const { data, ...rest } = await sw
      .table(ETable.strings)
      .orderBy("word", "ASC")
      .select(null, 20, 0);

    console.log(rest);

    return data;
  }
);
