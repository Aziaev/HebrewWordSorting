import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ELanguage } from "../../../common/constants";

export interface IApp {
  appLanguage: ELanguage.ru | ELanguage.ua | ELanguage.en;
}

const initialState: IApp = {
  appLanguage: ELanguage.ru,
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setAppLanguage(
      state,
      action: PayloadAction<ELanguage.ru | ELanguage.ua | ELanguage.en>
    ) {
      state.appLanguage = action.payload;
    },
  },
});
