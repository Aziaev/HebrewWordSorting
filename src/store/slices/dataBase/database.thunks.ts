import { createAsyncThunk } from "@reduxjs/toolkit";
import { version } from "../../../assets/json/version.json";
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
import spisok1 from "../../../assets/json/spisok1.json";
import strings from "../../../assets/json/stringsWithSortKey.json";
import { database } from "../../../index";
import map from "lodash/map";
import { createLatinSortKey } from "../../../common/helpers";

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
      // @ts-expect-error
      const sw = new SQLiteWrapper(database);

      // const strings = map(spisok1, (item: any) => ({
      //   ...item,
      //   sortKey: createLatinSortKey(item.word),
      // }));

      dispatch(databaseSlice.actions.setProgress("creating strings"));
      await sw.dropTable(ETable.strings);
      await sw.createTable(ETable.strings, StringSchema);
      await sw.insert(ETable.strings, strings);

      dispatch(databaseSlice.actions.setProgress("creating nikud"));
      await sw.dropTable(ETable.nikud);
      await sw.createTable(ETable.nikud, NikudSchema);
      await sw.insert(ETable.nikud, nikudJson);

      const roots = map(rootsJson, (root) => ({
        ...root,
        ruLowerCase: root.ru.toLowerCase(),
        uaLowerCase: root.ua.toLowerCase(),
        enLowerCase: root.en.toLowerCase(),
      }));

      dispatch(databaseSlice.actions.setProgress("creating roots"));
      await sw.dropTable(ETable.roots);
      await sw.createTable(ETable.roots, RootsSchema);
      await sw.insert(ETable.roots, roots);

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
