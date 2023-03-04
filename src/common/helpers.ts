const hebrewLetterRegexp = /[\u0590-\u05fe]/;

export function getIsHebrewText(text: string) {
  return hebrewLetterRegexp.test(text?.[0]);
}
