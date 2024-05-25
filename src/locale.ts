// https://www.techonthenet.com/js/language_tags.php
import getUserLocale from "get-user-locale";
import { gstate } from "./global";
import { MenuProps } from "antd";
import { locales } from "./modules";

const localeCacheKey = "Pic-Smaller-Locale";
const defaultLang = "en-US";

export const langList: MenuProps["items"] = [
  { key: "en-US", label: "English" },
  { key: "ko-KR", label: "한국인" },
  { key: "ja-JP", label: "日本語" },
  { key: "zh-TW", label: "繁體中文" },
  { key: "zh-CN", label: "简体中文" },
];

function getLang() {
  let lang = window.localStorage.getItem(localeCacheKey);
  if (!lang) {
    lang = getUserLocale();
  }
  return lang ?? defaultLang;
}

async function setLocaleData(lang: string) {
  let importer: any = locales[`/src/locales/${lang}.ts`];
  if (!importer) {
    importer = locales[`/src/locales/${defaultLang}.ts`];
  }
  gstate.locale = (await importer()).default;
}

export async function changeLang(lang: string) {
  gstate.lang = lang;
  window.localStorage.setItem(localeCacheKey, lang);
  await setLocaleData(lang);
}

export async function initLang() {
  gstate.lang = getLang();
  await setLocaleData(gstate.lang);
}
