import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EStatus, IString, IVerb, IWordRoot } from "../../../types";
import {
  fetchInfinite,
  fetchRoots,
  searchBinyans,
  searchMatchingWords,
} from "./wordDetails.thunks";
import { ELanguage } from "../../../common/constants";

export interface IStringsState {
  clickedItem?: IString | IWordRoot;
  search?: string;
  language?: ELanguage.ru | ELanguage.ua | ELanguage.en;
  error?: string;
  status: EStatus;
  list: IString[];
  selected?: IString;
  verbs: IVerb[];
  roots: IWordRoot[];
  binyans?: IVerb;
  selectedBinyan?: string;
  infinite?: IWordRoot;
}

const initialState: IStringsState = {
  status: EStatus.ready,
  list: [],
  verbs: [],
  roots: [],
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
      state.clickedItem = action.payload.clickedItem;
      state.search = action.payload.search;
      state.language = action.payload.language;
    },
    setSelected(state, action: PayloadAction<IString>) {
      state.selected = action.payload;
    },
    setSelectedBinyan(state, action: PayloadAction<string>) {
      state.selectedBinyan = action.payload;
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(searchMatchingWords.pending, (state) => {
      state.error = undefined;
      state.status = EStatus.loading;
    });
    builder.addCase(searchMatchingWords.fulfilled, (state, action) => {
      state.error = undefined;
      state.status = EStatus.ready;
      state.list = action.payload;
    });
    builder.addCase(searchMatchingWords.rejected, (state, action: any) => {
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });

    builder.addCase(searchBinyans.pending, (state) => {
      state.error = undefined;
      state.status = EStatus.loading;
    });
    builder.addCase(searchBinyans.fulfilled, (state, action) => {
      state.error = undefined;
      state.status = EStatus.ready;
      state.binyans = action.payload;
    });
    builder.addCase(searchBinyans.rejected, (state, action: any) => {
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });

    builder.addCase(fetchRoots.pending, (state) => {
      state.error = undefined;
      state.status = EStatus.loading;
    });
    builder.addCase(
      fetchRoots.fulfilled,
      (state, action: PayloadAction<IWordRoot[]>) => {
        state.error = undefined;
        state.status = EStatus.ready;
        state.roots = action.payload;
      }
    );
    builder.addCase(fetchRoots.rejected, (state, action: any) => {
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });

    builder.addCase(fetchInfinite.pending, (state) => {
      state.error = undefined;
      state.status = EStatus.loading;
    });
    builder.addCase(
      fetchInfinite.fulfilled,
      (state, action: PayloadAction<IWordRoot>) => {
        state.error = undefined;
        state.status = EStatus.ready;
        state.infinite = action.payload;
      }
    );
    builder.addCase(fetchInfinite.rejected, (state, action: any) => {
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });
  },
});
