export enum EZIndex {
  loader = 10,
}

export enum ELanguage {
  ru = "ru",
  en = "en",
  ua = "ua",
  he = "he",
}

export const FLAGS_MAP = {
  [ELanguage.he]: "🇮🇱",
  [ELanguage.ru]: "🇷🇺",
  [ELanguage.en]: "🇺🇸",
  [ELanguage.ua]: "🇺🇦",
};

export const INPUT_PLACEHOLDER = {
  [ELanguage.ru]: "Введите слово (букву)",
  [ELanguage.ua]: "Введіть слово (літеру)",
  [ELanguage.en]: "Type a word (letter)",
};

export const APP_TITLE = {
  [ELanguage.ru]: "Сортировщик слов",
  [ELanguage.ua]: "Сортувальник слів",
  [ELanguage.en]: "Word sorter",
};
