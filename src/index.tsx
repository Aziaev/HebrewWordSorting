import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { FC, useEffect } from "react";
import registerRootComponent from "expo/build/launch/registerRootComponent";
import store from "./store";
import { Provider } from "react-redux";
import { useDatabaseDispatchedActions } from "./store/slices/dataBase/database.hooks";
import { LogBox } from "react-native";
import * as SQLite from "expo-sqlite";
import { open } from "sqlite";

export const dbName = "HebrewWordSorting";

const db = SQLite.openDatabase("dbName");

LogBox.ignoreAllLogs();

export const database = SQLite.openDatabase(dbName);

const Provided: FC = () => {
  const { initDb } = useDatabaseDispatchedActions();

  useEffect(() => {
    void initDb();
  }, [initDb]);

  return (
    <>
      <Navigation />
      <StatusBar />
    </>
  );
};

const App: FC = () => {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Provided />
      </SafeAreaProvider>
    </Provider>
  );
};

registerRootComponent(App);
