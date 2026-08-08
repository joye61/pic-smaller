import {
  defaultLocale,
  getLocalePath,
  isSupportedLocale,
  localeOptions,
} from "./locale-config";

export const langList: Array<{ key: string; label: string }> = [
  ...localeOptions,
];

export function changeLang(lang: string) {
  const locale = isSupportedLocale(lang) ? lang : defaultLocale;
  window.localStorage.setItem("Pic-Smaller-Locale", locale);
  window.location.assign(getLocalePath(locale));
}
