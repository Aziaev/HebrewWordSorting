const hebrewLetterRegexp = /[\u0590-\u05fe]/;

export function getIsHebrewText(text?: string) {
  if (!text) {
    return false;
  }

  return hebrewLetterRegexp.test(text?.[0]);
}

export function createLatinSortKey(word: string) {
  return Array.from(word)
    .map((letter) => lettersMap[letter])
    .join("");
}

const lettersMap: Record<string, string> = {
  א: "a",
  ב: "b",
  ג: "c",
  ד: "d",
  ה: "e",
  ו: "f",
  ז: "g",
  ח: "h",
  ט: "i",
  י: "j",
  כ: "k",
  ך: "k",
  ל: "l",
  מ: "m",
  ם: "m",
  נ: "n",
  ן: "n",
  ס: "o",
  ע: "p",
  פ: "q",
  ף: "q",
  צ: "r",
  ץ: "r",
  ק: "s",
  ר: "t",
  ש: "u",
  ת: "v",
};
