import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useAppDispatch } from "../../index";
import { searchByString } from "./strings.thunks";
import { IStringsState, stringsSlice } from "./strings";

export function useStringsDispatchedActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      searchByString: ({ search }: { search: string }) =>
        dispatch(searchByString({ search })),
      setSearch: (search: string) =>
        dispatch(stringsSlice.actions.setSearch(search)),
    }),
    [dispatch]
  );
}

export function useStringsStateSelector() {
  return (useSelector<any>((state) => state?.strings) || {}) as IStringsState;
}
