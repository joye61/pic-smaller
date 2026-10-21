export const siteUrl = "https://img.arcanelune.top";
export const defaultLocale = "zh-CN";

export const localeOptions = [
  { key: "zh-CN", label: "简体中文" },
  { key: "en-US", label: "English" },
] as const;

export type SupportedLocale = (typeof localeOptions)[number]["key"];

export const supportedLocales = localeOptions.map(({ key }) => key);

export const legacyLocales = [
  "zh-TW",
  "tr-TR",
  "fr-FR",
  "es-ES",
  "ko-KR",
  "ja-JP",
  "fa-IR",
] as const;

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.some((supported) => supported === locale);
}

export function isLegacyLocale(locale: string) {
  return legacyLocales.some((legacy) => legacy === locale);
}

export function getLocalePath(locale: SupportedLocale) {
  return `/${locale}`;
}
