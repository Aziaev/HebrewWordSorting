export const StringSchema = [
  {
    columnName: "id",
    dataType: "integer",
    primaryKey: true,
    autoIncrement: true,
  },
  {
    columnName: "roots",
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
    dataType: "text",
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
