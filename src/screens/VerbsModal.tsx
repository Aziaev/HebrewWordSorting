import {StatusBar} from "expo-status-bar";
import {Platform, StyleSheet} from "react-native";
import * as SQLite from "expo-sqlite";
import {Text, View} from "../components/Themed";
// @ts-expect-error
import SQLiteWrapper from "sqlite-js-wrapper";
import {useEffect, useState} from "react";
import {map} from "lodash";
import {IVerb} from "../types";
import {dbName, ETable} from "../db/constants";

export default function VerbsModal() {

  const ready = true;
  const [list, setList] = useState<IVerb[]>([]);

  useEffect(() => {
    async function fetchList() {
      try {
        const db = SQLite.openDatabase(dbName);
        const sw = new SQLiteWrapper(db);

        const {data} = await sw.table(ETable.verbs).select(null, 20, 0);

        setList(data);
      } catch (e) {
        console.log("error", e);
      }
    }

    if (ready) {
      void fetchList();
    }
  }, [ready]);

  return (
    <View style={styles.container}>
      {map(list, (row, index) => (
        <Text style={styles.list} key={index}>
          {row.base} {row.face}
        </Text>
      ))}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  list: {
    fontSize: 16,
    fontWeight: "normal",
  },
});
