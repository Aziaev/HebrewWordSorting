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

export const SELECT_APP_LANGUAGE = {
  [ELanguage.ru]: "Выберите язык приложения",
  [ELanguage.ua]: "Виберіть мову програми",
  [ELanguage.en]: "Select app language",
};

export const NOTHING_FOUND = {
  [ELanguage.ru]: "Ничего не найдено",
  [ELanguage.ua]: "Нічого не знайдено",
  [ELanguage.en]: "Nothing found",
};

export const SELECTED_APP_LANGUAGE = {
  [ELanguage.ru]: "Выбран язык: Русский",
  [ELanguage.ua]: "Вибрана мова: Український",
  [ELanguage.en]: "Selected language: English",
};

export enum ETable {
  strings = "strings",
  roots = "roots",
  times = "times",
  verbs = "verbs",
  nikud = "nikud",
  stringList = "stringList",
  rootList = "rootList",
  tempStringList = "tempStringList",
  tempRootsList = "tempRootsList",
}
