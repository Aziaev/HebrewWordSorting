import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import { IString, IWordRoot } from "../../../types";
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
import { getIsHebrewText } from "../../../common/helpers";

export const searchMatchingWords = createAsyncThunk(
  "wordDetails/searchMatchingWords",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { clickedItem, search, language } = state.wordDetails;

    let list = [];
    console.log({ clickedItem, search });

    const isHebrewSearch = getIsHebrewText(search);
    const hasHebrewSearchMatch =
      isHebrewSearch && (clickedItem as IString).word === search;
    const hasTranslationSearchMatch = !isHebrewSearch;

    // @ts-expect-error
    const isHebrewWordClicked = clickedItem?.word && !clickedItem?.string;

    const hasSearch = !!search;

    const searchHebrewRoot = isHebrewWordClicked
      ? (clickedItem as IString).word
      : (clickedItem as IWordRoot)?.string.word;

    if (!search) {
      list = await queryMatchingHebrewWords(searchHebrewRoot);
    } else {
      list = await queryMatchingHebrewWords(searchHebrewRoot);
    }

    if (search && !isHebrewSearch) {
      const searchWord = clickedItem as IWordRoot;
    }

    // if(hebrewSearch && hasMatchingInClicked){
    //   search matching hebrewWords
    // }

    // if(hebrewSearch && !hasMatchingInClicked){
    //   search clicked hebrew word matched hebrewWords
    // }

    // if(!hebrewSearch && hasMatchingTranslation){
    //   fetch matching roots with strings
    // }

    const clickedItemId =
      (clickedItem as IWordRoot)?.string?.id || clickedItem?.id;

    dispatch(
      wordDetailsSlice.actions.setSelected(
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

function checkWordHasMatch(searchString: string, sentence: string) {
  let result = false;

  const patterns = [
    `${searchString},%`,
    `%, ${searchString},%`,
    `%,${searchString},%`,
    `%, ${searchString}`,
    `%,${searchString}`,
  ];

  if (searchString === sentence) {
    result = true;
  }

  return result;
}
