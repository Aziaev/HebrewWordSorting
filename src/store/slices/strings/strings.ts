import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EStatus, IString } from "../../../types";
import { fetchNextPage, searchByString } from "./strings.thunks";

export interface IStringsState {
  search: string;
  lang: ELanguage;
  error: string | null | undefined;
  status: EStatus;
  list: IString[];
  limit: number;
  offset: number;
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
  limit: 30,
  offset: 0,
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
    builder.addCase(searchByString.fulfilled, (state, action) => {
      state.error = null;
      state.status = EStatus.ready;
      state.list = action.payload.list;
      state.offset = action.payload.offset;
      state.limit = action.payload.limit;
    });
    builder.addCase(searchByString.rejected, (state, action: any) => {
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });
    builder.addCase(fetchNextPage.pending, (state) => {
      state.error = null;
      state.status = EStatus.loading;
    });
    builder.addCase(fetchNextPage.fulfilled, (state, action) => {
      state.error = null;
      state.status = EStatus.ready;
      state.list.push(...action.payload.list);
      state.offset = action.payload.offset;
      state.limit = action.payload.limit;
    });
    builder.addCase(fetchNextPage.rejected, (state, action: any) => {
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });
  },
});
