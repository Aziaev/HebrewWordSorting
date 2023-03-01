import { ELanguage } from "../store/slices/strings/strings";

export function getIsRtl(lang: ELanguage) {
  return lang === ELanguage.he;
}
