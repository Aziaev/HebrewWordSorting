# Иврит сортировщик слов
Мобильное приложение которое опубликовано в Google Play и в App Store

Порядок обновления данных
Открыть Basa2.mdb и конвертировать таблицы в отдельные xls файлы
xls файлы конвертировать в JSON через https://excel2json.io
Положить json файлы в папку src/assets/json
Переименовать поля в файлах по этой схеме:
```typescript
const keysMap: Record<string, string> = {
  Roots: "roots",
  Links: "links",
  Binyan: "binyan",
  Word: "word",
  Word_u: "ua",
  Word_a: "en",
  Words1: "words1",
  Words: "words",
  Naimenovaniya: "name",
  Oglasovki: "pronunciation",
  roots: "root",
};
```
