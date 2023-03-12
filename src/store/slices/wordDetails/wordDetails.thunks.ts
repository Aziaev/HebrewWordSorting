import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import { IString, IVerb, IWordRoot } from "../../../types";
import {
  queryBinyans,
  queryInfinitiveTranslations,
  queryMatchingHebrewWords,
  queryRoots,
  queryVerbInfinitive,
  queryVerbs,
} from "./wordDetails.helpers";
import { wordDetailsSlice } from "./wordDetails";
import { find } from "lodash";

export const searchMatchingWords = createAsyncThunk(
  "wordDetails/searchMatchingWords",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { clickedItem } = state.wordDetails;

    // @ts-expect-error
    const isHebrewWordClicked = clickedItem?.word && !clickedItem?.string;

    const searchHebrewRoot = isHebrewWordClicked
      ? (clickedItem as IString).word
      : (clickedItem as IWordRoot)?.string.word;

    if (!searchHebrewRoot) {
      return [];
    }

    const list = await queryMatchingHebrewWords(searchHebrewRoot);

    const clickedItemId =
      (clickedItem as IWordRoot)?.string?.id || clickedItem?.id;

    dispatch(
      wordDetailsSlice.actions.setSelected(
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        <IString>find(list, { id: clickedItemId })
      )
    );

    return list;
  }
);

export const searchBinyans = createAsyncThunk(
  "wordDetails/searchBinyans",
  async (str: IString) => {
    const binyans = await queryBinyans(str);

    return binyans;
  }
);

export const fetchRoots = createAsyncThunk(
  "wordDetails/fetchRoots",
  async (str: IString) => {
    const roots = await queryRoots(str);

    return roots;
  }
);

export const fetchVerbInfinitive = createAsyncThunk(
  "wordDetails/fetchVerbInfinitive",
  async ({ str, selectedBinyan }: { str: IString; selectedBinyan: string }) => {
    const infinitive = await queryVerbInfinitive(str, selectedBinyan);

    return infinitive;
  }
);

export const fetchInfinitiveTranslation = createAsyncThunk(
  "wordDetails/fetchInfinitiveTranslations",
  async ({ root, binyan }: { root: string; binyan: string }) => {
    const data = await queryInfinitiveTranslations({ root, binyan });

    return data[0];
  }
);

export const fetchVerbs = createAsyncThunk(
  "wordDetails/fetchVerbs",
  async (root: string) => {
    const verbs = await queryVerbs(root);

    return verbs;
  }
);
