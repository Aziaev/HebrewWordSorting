import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useAppDispatch } from "../../index";
import { fetchNextPage, searchByString } from "./strings.thunks";
import { IStringsState, stringsSlice } from "./strings";

export function useStringsDispatchedActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      searchByString: () => dispatch(searchByString()),
      fetchNextPage: () => dispatch(fetchNextPage()),
      setSearch: (search: string) =>
        dispatch(stringsSlice.actions.setSearch(search)),
    }),
    [dispatch]
  );
}

export function useStringsStateSelector() {
  return (useSelector<any>((state) => state?.strings) || {}) as IStringsState;
}
