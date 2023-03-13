import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import { IString, IWordRoot } from "../../../types";
import {
  queryBinyans,
  queryInfinitiveTranslations,
  queryMatchingHebrewWords,
  queryMatchingOtherLanguageWords,
  queryRoots,
  queryVerbInfinitive,
  queryVerbs,
} from "./wordDetails.helpers";
import { wordDetailsSlice } from "./wordDetails";
import { find, some } from "lodash";

export const searchMatchingWords = createAsyncThunk(
  "wordDetails/searchMatchingWords",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { clickedItem, search, language } = state.wordDetails;

    let list = [];

    const translation =
      search && language && (clickedItem as IWordRoot)[`${language}LowerCase`];

    const hasTranslationMatch =
      translation &&
      checkWordHasMatchTranslation(search.toLowerCase(), translation);

    if (hasTranslationMatch) {
      list = await queryMatchingOtherLanguageWords({ search, language });
    } else {
      // @ts-expect-error
      const isHebrewWordClicked = clickedItem?.word && !clickedItem?.string;

      const searchHebrewRoot = isHebrewWordClicked
        ? (clickedItem as IString).word
        : (clickedItem as IWordRoot)?.string.word;
      list = await queryMatchingHebrewWords(searchHebrewRoot);
    }

    const clickedItemId =
      (clickedItem as IWordRoot)?.string?.id || clickedItem?.id;

    dispatch(
      wordDetailsSlice.actions.setSelected(
        find(list, { id: clickedItemId }) as IString
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

function checkWordHasMatchTranslation(searchString: string, sentence: string) {
  console.log({ searchString, sentence });

  let result = false;

  const inSentencePattern = [
    `${searchString},`,
    `, ${searchString},`,
    `,${searchString},`,
    `, ${searchString}`,
    `,${searchString}`,
  ];

  if (searchString === sentence) {
    result = true;
  }

  if (some(inSentencePattern, (pattern) => sentence.includes(pattern))) {
    result = true;
  }

  return result;
}
