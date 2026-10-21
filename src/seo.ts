import type { Metadata } from "next";
import type { LocaleData } from "./type";
import {
  getLocalePath,
  siteUrl,
  supportedLocales,
  type SupportedLocale,
} from "./locale-config";

export const metadataBase = new URL(siteUrl);

export const languageAlternates = Object.fromEntries(
  supportedLocales.map((locale) => [locale, getLocalePath(locale)]),
);

export function createLocaleMetadata(
  locale: SupportedLocale,
  localeData: LocaleData,
): Metadata {
  return {
    metadataBase,
    title: localeData.siteTitle,
    description: localeData.siteDescription,
    alternates: {
      canonical: getLocalePath(locale),
      languages: {
        ...languageAlternates,
        "x-default": "/zh-CN",
      },
    },
    openGraph: {
      type: "website",
      url: getLocalePath(locale),
      title: localeData.siteTitle,
      description: localeData.siteDescription,
      siteName: "LunePic",
      locale: locale.replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: localeData.siteTitle,
      description: localeData.siteDescription,
    },
    icons: {
      icon: "/lunepic-logo.svg",
    },
    other: {
      google: "notranslate",
    },
  };
}
