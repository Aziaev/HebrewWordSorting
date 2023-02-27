import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EStatus, IString } from "../../../types";
import { searchByString } from "./strings.thunks";

export interface IStringsState {
  search: string;
  lang: ELanguage;
  error: string | null | undefined;
  status: EStatus;
  list: IString[];
}

export enum ELanguage {
  ru = "ru",
  en = "en",
  ua = "ua",
  he = "he",
}

const initialState: IStringsState = {
  search: "",
  lang: ELanguage.he,
  error: null,
  status: EStatus.ready,
  list: [],
};

export const stringsSlice = createSlice({
  name: "strings",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchByString.pending, (state) => {
      state.error = null;
      state.status = EStatus.loading;
    });
    builder.addCase(
      searchByString.fulfilled,
      (state, action: PayloadAction<IString[]>) => {
        state.error = null;
        state.status = EStatus.ready;
        state.list = action.payload;
      }
    );
    builder.addCase(searchByString.rejected, (state, action: any) => {
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });
  },
});
