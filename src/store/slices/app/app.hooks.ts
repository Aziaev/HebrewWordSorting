import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useAppDispatch } from "../../index";
import { appSlice, IApp } from "./app";
import { ELanguage } from "../../../common/constants";

export function useAppDispatchedActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      setAppLanguage: (lang: ELanguage.ru | ELanguage.ua | ELanguage.en) =>
        dispatch(appSlice.actions.setAppLanguage(lang)),
    }),
    [dispatch]
  );
}

export function useAppSelector() {
  return (useSelector<any>((state) => state?.app) || {}) as IApp;
}
