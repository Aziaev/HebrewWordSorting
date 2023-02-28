import { ELanguage } from "../store/slices/strings/strings";

export enum EZIndex {
  loader = 10,
}

export const FLAGS_MAP = {
  [ELanguage.he]: "🇮🇱",
  [ELanguage.ru]: "🇷🇺",
  [ELanguage.en]: "🇺🇸",
  [ELanguage.ua]: "🇺🇦",
};
