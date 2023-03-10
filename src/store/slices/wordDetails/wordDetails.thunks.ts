import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import { IString, IWordRoot } from "../../../types";
import { queryMatchingHebrewWords, queryVerbs } from "./wordDetails.helpers";
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
export const searchVerbs = createAsyncThunk(
  "wordDetails/searchVerbs",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { selected } = state.wordDetails;

    const verbs = await queryVerbs(selected as IString);

    return verbs;
  }
);
