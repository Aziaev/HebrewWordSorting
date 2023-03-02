import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ELanguage } from "../strings/strings";

export interface IApp {
  appLanguage: ELanguage.ru | ELanguage.ua;
}

const initialState: IApp = {
  appLanguage: ELanguage.ru,
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<ELanguage.ru | ELanguage.ua>) {
      state.appLanguage = action.payload;
    },
  },
});
