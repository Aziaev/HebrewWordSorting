import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
import { Text, View } from "../components/Themed";
// @ts-expect-error
import SQLiteWrapper from "sqlite-js-wrapper";
import { dbName, ETable } from "../store/slices/dataBase/database.thunks";
import { useEffect, useState } from "react";
import { useDatabaseStateSelector } from "../store/slices/dataBase/database.hooks";
import { map } from "lodash";
import { IString } from "../types";

export default function StringsModal() {
  const { ready } = useDatabaseStateSelector();
  const [list, setList] = useState<IString[]>([]);

  useEffect(() => {
    async function fetchList() {
      const db = SQLite.openDatabase(dbName);
      const sw = new SQLiteWrapper(db);

      const { data } = await sw
        .table(ETable.strings)
        .orderBy("word", "ASC")
        .select(null, 20, 0);

      setList(data);
    }

    if (ready) {
      void fetchList();
    }
  }, [ready]);

  return (
    <View style={styles.container}>
      {map(list, (row, index) => (
        <Text style={styles.list} key={index}>
          {row.word} {row.words}
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
