import {
  defaultLocale,
  getLocalePath,
  isSupportedLocale,
  localeOptions,
} from "./locale-config";
import { localeStorageKey } from "./storage";

export const langList: Array<{ key: string; label: string }> = [
  ...localeOptions,
];

export function changeLang(lang: string) {
  const locale = isSupportedLocale(lang) ? lang : defaultLocale;
  window.localStorage.setItem(localeStorageKey, locale);
  window.location.assign(getLocalePath(locale));
}
