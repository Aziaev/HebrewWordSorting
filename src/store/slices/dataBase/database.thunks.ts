import { createAsyncThunk } from "@reduxjs/toolkit";
import { version } from "../../../assets/json/version.json";
import * as SQLite from "expo-sqlite";
import stringsJson from "../../../assets/json/spisok1.json";
import nikudJson from "../../../assets/json/oglasovki.json";
import rootsJson from "../../../assets/json/kornevoy_slovar.json";
import timesJson from "../../../assets/json/times.json";
import verbsJson from "../../../assets/json/tablisi_glagolov.json";
import {
  NikudSchema,
  RootsSchema,
  StringSchema,
  TimesSchema,
  VerbsSchema,
} from "../../../types";
import { databaseSlice } from "./database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EAsyncStorageKey } from "../../constants";
import SQLiteWrapper from "../../../common/SQLWrapper";

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
  async (_, { dispatch }) => {
    const storedVersion = await AsyncStorage.getItem(EAsyncStorageKey.version);

    if (storedVersion !== version) {
      const db = SQLite.openDatabase(dbName);
      // @ts-expect-error
      const sw = new SQLiteWrapper(db);

      dispatch(databaseSlice.actions.setProgress("creating strings"));
      await sw.dropTable(ETable.strings);
      await sw.createTable(ETable.strings, StringSchema);
      await sw.insert(ETable.strings, stringsJson);

      dispatch(databaseSlice.actions.setProgress("creating nikud"));
      await sw.dropTable(ETable.nikud);
      await sw.createTable(ETable.nikud, NikudSchema);
      await sw.insert(ETable.nikud, nikudJson);

      dispatch(databaseSlice.actions.setProgress("creating roots"));
      await sw.dropTable(ETable.roots);
      await sw.createTable(ETable.roots, RootsSchema);
      await sw.insert(ETable.roots, rootsJson);

      dispatch(databaseSlice.actions.setProgress("creating times"));
      await sw.dropTable(ETable.times);
      await sw.createTable(ETable.times, TimesSchema);
      await sw.insert(ETable.times, timesJson);

      dispatch(databaseSlice.actions.setProgress("creating verbs"));
      await sw.dropTable(ETable.verbs);
      await sw.createTable(ETable.verbs, VerbsSchema);
      await sw.insert(ETable.verbs, verbsJson);

      console.log(" DB READY");

      await AsyncStorage.setItem(EAsyncStorageKey.version, version);
    }
  }
);

const keysMap: Record<string, string> = {
  Roots: "roots",
  Links: "links",
  Binyan: "binyan",
  Word: "word",
  Word_u: "ua",
  Word_a: "en",
  Words1: "words1",
  Words: "words",
  Naimenovaniya: "name",
  Oglasovki: "pronunciation",
};
