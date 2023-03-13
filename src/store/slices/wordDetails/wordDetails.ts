import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EStatus, IString, IVerb, IWordRoot } from "../../../types";
import {
  fetchVerbInfinitive,
  fetchRoots,
  searchBinyans,
  searchMatchingWords,
  fetchVerbs,
  fetchInfinitiveTranslation,
} from "./wordDetails.thunks";
import { ELanguage } from "../../../common/constants";

export interface IStringsState {
  clickedItem?: IString | IWordRoot;
  search: string;
  language?: ELanguage.ru | ELanguage.ua | ELanguage.en;
  error?: string;
  status: EStatus;
  list: IString[];
  selected?: IString;
  verbs: IVerb[];
  roots: IWordRoot[];
  binyans?: IVerb;
  selectedBinyan?: TBinyan;
  infinitive?: IVerb;
  infinitiveTranslation?: IWordRoot;
}

export type TBinyan = "g" | "f" | "e" | "d" | "c" | "b" | "a";

const initialState: IStringsState = {
  search: "",
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
    setSelectedBinyan(state, action: PayloadAction<TBinyan>) {
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

    builder.addCase(fetchVerbInfinitive.pending, (state) => {
      state.error = undefined;
      state.status = EStatus.loading;
    });
    builder.addCase(
      fetchVerbInfinitive.fulfilled,
      (state, action: PayloadAction<IVerb>) => {
        state.error = undefined;
        state.status = EStatus.ready;
        state.infinitive = action.payload;
      }
    );
    builder.addCase(fetchVerbInfinitive.rejected, (state, action: any) => {
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });

    builder.addCase(fetchVerbs.pending, (state) => {
      state.error = undefined;
      state.status = EStatus.loading;
    });
    builder.addCase(
      fetchVerbs.fulfilled,
      (state, action: PayloadAction<IVerb[]>) => {
        state.error = undefined;
        state.status = EStatus.ready;
        state.verbs = action.payload;
      }
    );
    builder.addCase(fetchVerbs.rejected, (state, action: any) => {
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }

      state.status = EStatus.error;
    });

    builder.addCase(fetchInfinitiveTranslation.pending, (state) => {
      state.error = undefined;
      state.status = EStatus.loading;
    });
    builder.addCase(
      fetchInfinitiveTranslation.fulfilled,
      (state, action: PayloadAction<IWordRoot>) => {
        state.error = undefined;
        state.status = EStatus.ready;
        state.infinitiveTranslation = action.payload;
      }
    );
    builder.addCase(
      fetchInfinitiveTranslation.rejected,
      (state, action: any) => {
        if (action.payload) {
          state.error = action.payload.errorMessage;
        } else {
          state.error = action.error.message;
        }

        state.status = EStatus.error;
      }
    );
  },
});
