import { useSelector } from "react-redux";
import { useMemo } from "react";
import { RootState, useAppDispatch } from "../../index";
import { IStringsState, wordDetailsSlice } from "./wordDetails";
import { searchMatchingWords, searchVerbs } from "./wordDetails.thunks";
import { IString } from "../../../types";

export function useWordDetailsScreenDispatchedActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      searchMatchingWords: () => {
        void dispatch(searchMatchingWords());
      },
      searchVerbs: () => {
        void dispatch(searchVerbs());
      },
      reset: () => dispatch(wordDetailsSlice.actions.reset()),
      setSearchProps: (
        payload: Pick<IStringsState, "clickedItem" | "search" | "language">
      ) => dispatch(wordDetailsSlice.actions.setSearchProps(payload)),
      setSelected: (item: IString) =>
        dispatch(wordDetailsSlice.actions.setSelected(item)),
    }),
    [dispatch]
  );
}

export function useWordDetailsScreenStateSelector() {
  return (useSelector<any>((state) => (state as RootState)?.wordDetails) ||
    {}) as IStringsState;
}
