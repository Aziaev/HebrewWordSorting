export enum EStatus {
  ready = "ready",
  loading = "loading",
  error = "error",
}

export interface IString {
  id: number;
  root: string;
  words: string;
  word: string;
  r: string;
  links: string;
  translations?: IWordRoot[];
  time?: ITime;
}

export const StringSchema = [
  {
    columnName: "id",
    dataType: "integer",
    primaryKey: true,
    autoIncrement: true,
  },
  {
    columnName: "root",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "words",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "word",
    dataType: "text COLLATE UNICODE",
    notNull: false,
  },
  {
    columnName: "r",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "links",
    dataType: "text",
    notNull: false,
  },
];

export const NikudSchema = [
  {
    columnName: "id",
    dataType: "integer",
    primaryKey: true,
    autoIncrement: true,
  },
  {
    columnName: "name",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "pronunciation",
    dataType: "text",
    notNull: false,
  },
];

export const TimesSchema = [
  {
    columnName: "id",
    dataType: "integer",
    primaryKey: true,
    autoIncrement: true,
  },
  {
    columnName: "r",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "time",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "pronouns",
    dataType: "text",
    notNull: false,
  },
];

export interface IWordRoot {
  id: string;
  links: string;
  binyan: string;
  ru: string;
  ua: string;
  en: string;
  words1: string;
  words: string;
}

export const RootsSchema = [
  {
    columnName: "id",
    dataType: "integer",
    primaryKey: true,
    autoIncrement: true,
  },
  {
    columnName: "root",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "links",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "binyan",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "ru",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "ua",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "en",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "words1",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "words",
    dataType: "text",
    notNull: false,
  },
];

export interface ITime {
  r: string;
  pronouns: string;
  time: string;
}

export interface INikud {
  name: string;
  pronunciation: string;
}

export interface IVerb {
  base: string;
  r: string;
  g: string;
  f: string;
  e: string;
  d: string;
  c: string;
  b: string;
  a: string;
  face: string;
}

export const VerbsSchema = [
  {
    columnName: "id",
    dataType: "integer",
    primaryKey: true,
    autoIncrement: true,
  },
  {
    columnName: "base",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "r",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "g",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "f",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "e",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "d",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "c",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "b",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "a",
    dataType: "text",
    notNull: false,
  },
  {
    columnName: "face",
    dataType: "text",
    notNull: false,
  },
];
