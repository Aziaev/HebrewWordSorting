import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../";
import { queryList, queryNextPage, queryTableCount } from "./strings.helpers";
import { ETable } from "../../../common/constants";

export const searchByString = createAsyncThunk(
  "strings/searchByString",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { language } = state.strings;
    const { search } = state.strings;
    const limit = 30;
    const offset = 0;

    const list = await queryList({
      search,
      limit,
      offset,
      language,
    });

    return { list, limit, offset };
  }
);

export const fetchNextPage = createAsyncThunk(
  "strings/fetchNextPage",
  async (_, { getState }: { getState: () => unknown }) => {
    const state = getState() as RootState;
    const { limit, offset, search } = state.strings;

    const count = await queryTableCount(ETable.rootList);

    if (offset / limit < count / limit) {
      const newOffset = offset + limit;
      const list = await queryNextPage({
        search,
        limit,
        offset: newOffset,
      });

      return { list, limit, offset: newOffset };
    }

    return { list: [], limit, offset };
  }
);
