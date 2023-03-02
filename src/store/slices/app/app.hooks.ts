import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useAppDispatch } from "../../index";
import { appSlice, IApp } from "./app";
import { ELanguage } from "../strings/strings";

export function useAppDispatchedActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      setLanguage: (lang: ELanguage.ru | ELanguage.ua) =>
        dispatch(appSlice.actions.setLanguage(lang)),
    }),
    [dispatch]
  );
}

export function useAppSelector() {
  return (useSelector<any>((state) => state?.app) || {}) as IApp;
}
