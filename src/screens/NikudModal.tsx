import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
import { Text, View } from "../common/components/Themed";
// @ts-expect-error
import SQLiteWrapper from "sqlite-js-wrapper";
import { useEffect, useState } from "react";
import { map } from "lodash";
import { INikud } from "../types";
import { dbName, ETable } from "../store/constants";

export default function NikudModal() {
  const ready = true;
  const [list, setList] = useState<INikud[]>([]);

  useEffect(() => {
    async function fetchList() {
      console.log("fetch nikud");
      const db = SQLite.openDatabase(dbName);
      const sw = new SQLiteWrapper(db);

      const { data } = await sw
        .table(ETable.nikud)
        .orderBy("name", "ASC")
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
          {row.name} {row.pronunciation}
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
