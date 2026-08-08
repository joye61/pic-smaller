export const siteUrl = "https://picsmaller.com";
export const defaultLocale = "en-US";

export const localeOptions = [
  { key: "en-US", label: "English" },
  { key: "zh-CN", label: "简体中文" },
  { key: "zh-TW", label: "繁體中文" },
  { key: "tr-TR", label: "Türkçe" },
  { key: "fr-FR", label: "Français" },
  { key: "es-ES", label: "Español" },
  { key: "ko-KR", label: "한국인" },
  { key: "ja-JP", label: "日本語" },
  { key: "fa-IR", label: "فارسی" },
] as const;

export type SupportedLocale = (typeof localeOptions)[number]["key"];

export const supportedLocales = localeOptions.map(({ key }) => key);

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.some((supported) => supported === locale);
}

export function getLocalePath(locale: SupportedLocale) {
  return `/${locale}/`;
}
