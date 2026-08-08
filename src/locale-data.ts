import type { LocaleData } from "./type";
import type { SupportedLocale } from "./locale-config";

type LocaleModule = { default: LocaleData };

const localeLoaders: Record<SupportedLocale, () => Promise<LocaleModule>> = {
  "en-US": () => import("./locales/en-US"),
  "es-ES": () => import("./locales/es-ES"),
  "fa-IR": () => import("./locales/fa-IR"),
  "fr-FR": () => import("./locales/fr-FR"),
  "ja-JP": () => import("./locales/ja-JP"),
  "ko-KR": () => import("./locales/ko-KR"),
  "tr-TR": () => import("./locales/tr-TR"),
  "zh-CN": () => import("./locales/zh-CN"),
  "zh-TW": () => import("./locales/zh-TW"),
};

export async function getLocaleData(locale: SupportedLocale) {
  return (await localeLoaders[locale]()).default;
}
