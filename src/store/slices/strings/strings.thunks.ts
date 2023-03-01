import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../";
import { queryCount, queryList } from "./strings.helpers";

export const dbName = "HebrewWordSorting";

export enum ETable {
  strings = "strings",
  roots = "roots",
  times = "times",
  verbs = "verbs",
  nikud = "nikud",
}

export const searchByString = createAsyncThunk(
  "strings/searchByString",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { limit, offset, search } = state.strings;

    const list = await queryList({
      search,
      limit,
      offset,
    });

    return { list, limit, offset };
  }
);

export const fetchNextPage = createAsyncThunk(
  "strings/fetchNextPage",
  async (_, { getState }: { getState: () => unknown }) => {
    const state = getState() as RootState;
    const { limit, offset, search } = state.strings;

    const count = await queryCount();

    if (search && offset / limit < count / limit) {
      const newOffset = offset + limit;
      const list = await queryList({
        search,
        limit,
        offset: newOffset,
      });

      return { list, limit, offset: newOffset };
    }

    return { list: [], limit, offset };
  }
);
