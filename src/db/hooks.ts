import {dbName, ETable} from "./constants";
import * as SQLite from "expo-sqlite";
import stringsJson from "../assets/json/strings.json";
import nikudJson from "../assets/json/nikud.json";
import rootsJson from "../assets/json/roots.json";
import timesJson from "../assets/json/times.json";
import verbsJson from "../assets/json/verbs.json";
// @ts-expect-error
import SQLiteWrapper from "sqlite-js-wrapper";
import {NikudSchema, RootsSchema, StringSchema, TimesSchema, VerbsSchema} from "./schemas";
import {useEffect, useState} from "react";

export const useDbInit = () => {
  const [status, setStatus] = useState<string>(null)

  const isInitRequired = true

  useEffect(() => {

    if (isInitRequired) {
      void initDb(setStatus)
    }

  }, [])

  return status
}

async function initDb(setStatus: (status: string) => void) {
  const db = SQLite.openDatabase(dbName);
  const sw = new SQLiteWrapper(db);

  setStatus("creating strings");

  await sw.dropTable(ETable.strings);

  await sw.createTable(ETable.strings, StringSchema);

  await sw.insert(ETable.strings, stringsJson);

  setStatus("creating nikud");

  await sw.dropTable(ETable.nikud);

  await sw.createTable(ETable.nikud, NikudSchema);

  await sw.insert(ETable.nikud, nikudJson);

  setStatus("creating roots");

  try {
    await sw.dropTable(ETable.roots);

    await sw.createTable(ETable.roots, RootsSchema);

    await sw.insert(ETable.roots, rootsJson);

    // forEach(rootsJson, async (root) => {
    //   await sw.insert(ETable.roots, root);
    // });
    setStatus("insert roots");
  } catch (e) {
    setStatus(e);
  }
  //
  setStatus("creating times");

  await sw.dropTable(ETable.times);

  await sw.createTable(ETable.times, TimesSchema);

  await sw.insert(ETable.times, timesJson);

  setStatus("creating verbs");

  await sw.dropTable(ETable.verbs);

  await sw.createTable(ETable.verbs, VerbsSchema);

  await sw.insert(ETable.verbs, verbsJson);

  setStatus("DB is ready");
}
