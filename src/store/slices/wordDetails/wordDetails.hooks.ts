import { useSelector } from "react-redux";
import { useMemo } from "react";
import { RootState, useAppDispatch } from "../../index";
import { IStringsState, TBinyan, wordDetailsSlice } from "./wordDetails";
import {
  fetchInfinitiveTranslation,
  fetchRoots,
  fetchVerbInfinitive,
  fetchVerbs,
  searchBinyans,
  searchMatchingWords,
} from "./wordDetails.thunks";
import { IString } from "../../../types";

export function useWordDetailsScreenDispatchedActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      searchMatchingWords: () => {
        void dispatch(searchMatchingWords());
      },
      searchBinyans: (str: IString) => {
        void dispatch(searchBinyans(str));
      },
      reset: () => dispatch(wordDetailsSlice.actions.reset()),
      setSelectedBinyan: (binyan: string) =>
        dispatch(wordDetailsSlice.actions.setSelectedBinyan(binyan as TBinyan)),
      setSearchProps: (
        payload: Pick<IStringsState, "clickedItem" | "search" | "language">
      ) => dispatch(wordDetailsSlice.actions.setSearchProps(payload)),
      setSelected: (item: IString) =>
        dispatch(wordDetailsSlice.actions.setSelected(item)),
      fetchRoots: async (item: IString) => await dispatch(fetchRoots(item)),
      fetchVerbInfinitive: async (str: IString, selectedBinyan: string) =>
        await dispatch(
          fetchVerbInfinitive({
            str,
            selectedBinyan,
          })
        ),
      fetchInfinitiveTranslations: async ({
        root,
        binyan,
      }: {
        root: string;
        binyan: string;
      }) => await dispatch(fetchInfinitiveTranslation({ root, binyan })),
      fetchVerbs: async (root: string) => await dispatch(fetchVerbs(root)),
    }),
    [dispatch]
  );
}

export function useWordDetailsScreenStateSelector() {
  return (useSelector<any>((state) => (state as RootState)?.wordDetails) ||
    {}) as IStringsState;
}
