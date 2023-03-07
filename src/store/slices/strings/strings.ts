import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EStatus, IString, IWordRoot } from "../../../types";
import { fetchNextPage, searchByString } from "./strings.thunks";

export interface IStringsState {
  search: string;
  error: string | null | undefined;
  status: EStatus;
  list: IString[] | IWordRoot[];
  limit: number;
  offset: number;
}

const initialState: IStringsState = {
  search: "אאבחן",
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
      console.log("searchByString.pending");
      state.error = null;
      state.status = EStatus.loading;
    });
    builder.addCase(searchByString.fulfilled, (state, action) => {
      console.log("searchByString.fulfilled");
      state.error = null;
      state.status = EStatus.ready;
      state.list = action.payload.list;
      state.offset = action.payload.offset;
      state.limit = action.payload.limit;
    });
    builder.addCase(searchByString.rejected, (state, action: any) => {
      console.log("searchByString.rejected", action.error);

      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });
    builder.addCase(fetchNextPage.pending, (state) => {
      console.log("fetchNextPage.pending");
      state.error = null;
      state.status = EStatus.loading;
    });
    builder.addCase(fetchNextPage.fulfilled, (state, action: any) => {
      console.log("fetchNextPage.fulfilled");
      state.error = null;
      state.status = EStatus.ready;
      state.list.push(...action.payload.list);
      state.offset = action.payload.offset;
      state.limit = action.payload.limit;
    });
    builder.addCase(fetchNextPage.rejected, (state, action: any) => {
      console.log("fetchNextPage.rejected", action.error);
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });
  },
});
