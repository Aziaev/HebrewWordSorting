import { useSelector } from "react-redux";
import { useMemo } from "react";
import { RootState, useAppDispatch } from "../../index";
import { IStringsState, wordDetailsSlice } from "./wordDetails";
import {
  fetchInfinite,
  fetchRoots,
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
        console.log("searchBinyans");
        void dispatch(searchBinyans(str));
      },
      reset: () => dispatch(wordDetailsSlice.actions.reset()),
      setSelectedBinyan: (binyan: string) =>
        dispatch(wordDetailsSlice.actions.setSelectedBinyan(binyan)),
      setSearchProps: (
        payload: Pick<IStringsState, "clickedItem" | "search" | "language">
      ) => dispatch(wordDetailsSlice.actions.setSearchProps(payload)),
      setSelected: (item: IString) =>
        dispatch(wordDetailsSlice.actions.setSelected(item)),
      fetchRoots: async (item: IString) => await dispatch(fetchRoots(item)),
      fetchInfinite: async (str: IString, selectedBinyan: string) =>
        await dispatch(
          fetchInfinite({
            str,
            selectedBinyan,
          })
        ),
    }),
    [dispatch]
  );
}

export function useWordDetailsScreenStateSelector() {
  return (useSelector<any>((state) => (state as RootState)?.wordDetails) ||
    {}) as IStringsState;
}
