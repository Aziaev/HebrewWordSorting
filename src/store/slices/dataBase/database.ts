import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EStatus } from "../../../types";
import { initDb } from "./database.thunks";

export interface IDatabase {
  ready: boolean;
  version: string;
  error: string | null | undefined;
  status: EStatus;
}

const initialState: IDatabase = {
  ready: false,
  version: "string",
  error: null,
  status: EStatus.ready,
};

export const databaseSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    setProgress(state, action: PayloadAction<any>) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initDb.pending, (state) => {
      state.error = null;
      state.status = EStatus.loading;
    });
    builder.addCase(initDb.fulfilled, (state) => {
      state.error = null;
      state.status = EStatus.ready;
      state.ready = true;
    });
    builder.addCase(initDb.rejected, (state, action: any) => {
      console.log("initDb.rejected", action);
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });
  },
});
