import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useAppDispatch } from "../../index";
import { fetchNextPage, searchByString } from "./strings.thunks";
import { IStringsState, stringsSlice } from "./strings";
import { ELanguage } from "../../../common/constants";

export function useStringsDispatchedActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      searchByString: () => {
        void dispatch(searchByString());
      },
      fetchNextPage: () => {
        void dispatch(fetchNextPage());
      },
      setSearch: (search: string) => {
        dispatch(stringsSlice.actions.setSearch(search));
      },
      setLanguage: (language: ELanguage.ru | ELanguage.ua | ELanguage.en) => {
        dispatch(stringsSlice.actions.setLanguage(language));
      },
    }),
    [dispatch]
  );
}

export function useStringsStateSelector() {
  return (useSelector<any>((state) => state?.strings) || {}) as IStringsState;
}
