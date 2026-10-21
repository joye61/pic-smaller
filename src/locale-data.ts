import type { LocaleData } from "./type";
import type { SupportedLocale } from "./locale-config";

type LocaleModule = { default: LocaleData };

const localeLoaders: Record<SupportedLocale, () => Promise<LocaleModule>> = {
  "en-US": () => import("./locales/en-US"),
  "zh-CN": () => import("./locales/zh-CN"),
};

export async function getLocaleData(locale: SupportedLocale) {
  return (await localeLoaders[locale]()).default;
}
