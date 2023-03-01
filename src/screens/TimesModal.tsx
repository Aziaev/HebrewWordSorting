import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
import { Text, View } from "../common/components/Themed";
// @ts-expect-error
import SQLiteWrapper from "sqlite-js-wrapper";
import { useEffect, useState } from "react";
import map from "lodash/map";
import { ITime } from "../types";
import { dbName, ETable } from "../store/constants";

export default function TimesModal() {
  const [list, setList] = useState<ITime[]>([]);

  useEffect(() => {
    async function fetchList() {
      const db = SQLite.openDatabase(dbName);
      const sw = new SQLiteWrapper(db);

      const { data } = await sw
        .table(ETable.times)
        .orderBy("time", "ASC")
        .select(null, 20, 0);

      setList(data);
    }

    void fetchList();
  });

  return (
    <View style={styles.container}>
      {map(list, (row, index) => (
        <Text style={styles.list} key={index}>
          {row.pronouns} {row.time} {row.r}
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
