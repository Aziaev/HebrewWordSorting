import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EStatus, IString, IVerb, IWordRoot } from "../../../types";
import { searchMatchingWords, searchVerbs } from "./wordDetails.thunks";
import { ELanguage } from "../../../common/constants";

export interface IStringsState {
  clickedItem: IString | IWordRoot | null;
  search: string | null;
  language: ELanguage.ru | ELanguage.ua | ELanguage.en | null;
  error: string | null | undefined;
  status: EStatus;
  list: IString[];
  selected: IString | null;
  verbs: IVerb[];
}

const initialState: IStringsState = {
  clickedItem: null,
  search: null,
  language: null,
  error: null,
  status: EStatus.ready,
  list: [],
  selected: null,
  verbs: [],
};

export const wordDetailsSlice = createSlice({
  name: "wordDetails",
  initialState,
  reducers: {
    setSearchProps(
      state,
      action: PayloadAction<
        Pick<IStringsState, "clickedItem" | "search" | "language">
      >
    ) {
      console.log("setSearchProps", action.payload);
      state.clickedItem = action.payload.clickedItem;
      state.search = action.payload.search;
      state.language = action.payload.language;
    },
    setSelected(state, action: PayloadAction<IString>) {
      console.log("setSelected");
      state.selected = action.payload;
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(searchMatchingWords.pending, (state) => {
      console.log("searchMatchingWords.pending");
      state.error = null;
      state.status = EStatus.loading;
    });
    builder.addCase(searchMatchingWords.fulfilled, (state, action) => {
      console.log("searchMatchingWords.fulfilled", action);
      state.error = null;
      state.status = EStatus.ready;
      state.list = action.payload;
    });
    builder.addCase(searchMatchingWords.rejected, (state, action: any) => {
      console.log("searchMatchingWords.rejected", action.error);

      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });
    builder.addCase(searchVerbs.pending, (state) => {
      console.log("searchVerbs.pending");
      state.error = null;
      state.status = EStatus.loading;
    });
    builder.addCase(searchVerbs.fulfilled, (state, action) => {
      console.log("searchVerbs.fulfilled", action);
      state.error = null;
      state.status = EStatus.ready;
      state.verbs = action.payload;
    });
    builder.addCase(searchVerbs.rejected, (state, action: any) => {
      console.log("searchVerbs.rejected", action);

      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });
  },
});
