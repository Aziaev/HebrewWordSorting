import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { databaseSlice } from "./slices/dataBase/database";
import { stringsSlice } from "./slices/strings/strings";
import { appSlice } from "./slices/app/app";

const store = configureStore({
  reducer: {
    database: databaseSlice.reducer,
    strings: stringsSlice.reducer,
    app: appSlice.reducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
