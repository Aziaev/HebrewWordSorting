import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import { version } from "../../../assets/json/version.json";
import * as SQLite from "expo-sqlite";
import stringsJson from "../../../assets/json/strings.json";
import nikudJson from "../../../assets/json/nikud.json";
import rootsJson from "../../../assets/json/roots.json";
import timesJson from "../../../assets/json/times.json";
import verbsJson from "../../../assets/json/verbs.json";
// @ts-expect-error
import SQLiteWrapper from "sqlite-js-wrapper";
import {
  NikudSchema,
  RootsSchema,
  StringSchema,
  TimesSchema,
  VerbsSchema,
} from "../../../types";
import { forEach, map } from "lodash";

export const dbName = "HebrewWordSorting";

export enum ETable {
  strings = "strings",
  roots = "roots",
  times = "times",
  verbs = "verbs",
  nikud = "nikud",
}

export const initDb = createAsyncThunk(
  "database/checkDatabaseUpdates",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;

    if (state.database.version !== version) {
      const db = SQLite.openDatabase(dbName);
      const sw = new SQLiteWrapper(db);

      console.log("createTable strings");

      await sw.dropTable(ETable.strings);

      await sw.createTable(ETable.strings, StringSchema);

      await sw.insert(ETable.strings, stringsJson);

      console.log("createTable nikud");

      await sw.dropTable(ETable.nikud);

      await sw.createTable(ETable.nikud, NikudSchema);

      await sw.insert(ETable.nikud, nikudJson);

      console.log("createTable roots");

      try {
        await sw.dropTable(ETable.roots);
        console.log("dropTable roots");

        await sw.createTable(ETable.roots, RootsSchema);
        console.log("createTable roots");

        await sw.insert(ETable.roots, rootsJson);

        // forEach(rootsJson, async (root) => {
        //   await sw.insert(ETable.roots, root);
        // });
        console.log("insert roots");
      } catch (e) {
        console.log(e);
      }
      //
      console.log("createTable times");

      await sw.dropTable(ETable.times);

      await sw.createTable(ETable.times, TimesSchema);

      await sw.insert(ETable.times, timesJson);

      console.log("createTable verbs");

      await sw.dropTable(ETable.verbs);

      await sw.createTable(ETable.verbs, VerbsSchema);

      await sw.insert(ETable.verbs, verbsJson);

      console.log(" DB READY");
    }
  }
);
