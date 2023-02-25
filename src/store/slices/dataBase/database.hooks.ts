import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useAppDispatch } from "../../index";
import { initDb } from "./database.thunks";
import { IDatabase } from "./database";

export function useDatabaseDispatchedActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      initDb: () => dispatch(initDb()),
    }),
    [dispatch]
  );
}

export function useDatabaseStateSelector() {
  return (useSelector<any>((state) => state?.database) || {}) as IDatabase;
}
