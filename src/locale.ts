import getUserLocale from "get-user-locale";
import { LocaleData } from "./locales/type";
import { gstate } from "./global";
import { MenuProps } from "antd";

const localeCacheKey = "Pic-Smaller-Locale";
const defaultLang = "en-US";

// https://www.techonthenet.com/js/language_tags.php
const localeDataMap: Record<string, Promise<{ default: LocaleData }>> = {
  "zh-CN": import("./locales/zh-CN"),
  "zh-TW": import("./locales/zh-TW"),
  "zh-Hans": import("./locales/zh-CN"),
  "en-US": import("./locales/en-US"),
  "ja-JP": import("./locales/ja-JP"),
  "ko-KR": import("./locales/ko-KR"),
};

export const langList: MenuProps["items"] = [
  { key: "en-US", label: "English" },
  { key: "ko-KR", label: "한국인" },
  { key: "ja-JP", label: "日本語" },
  { key: "zh-TW", label: "繁體中文" },
  { key: "zh-CN", label: "简体中文" },
];

export function getLang() {
  let lang = window.localStorage.getItem(localeCacheKey);
  if (!lang) {
    lang = getUserLocale();
  }
  gstate.lang = lang ?? defaultLang;
}

export async function setLocaleData() {
  let importer = localeDataMap[gstate.lang];
  if (!importer) {
    importer = localeDataMap[defaultLang];
  }
  gstate.locale = (await importer).default;
}

export async function changeLang(lang: string) {
  gstate.lang = lang;
  window.localStorage.setItem(localeCacheKey, gstate.lang);
  await setLocaleData();
}

export async function initLangSetting() {
  getLang();
  await setLocaleData();
}
