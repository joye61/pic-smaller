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
        "x-default": "/en-US/",
      },
    },
    openGraph: {
      type: "website",
      url: getLocalePath(locale),
      title: localeData.siteTitle,
      description: localeData.siteDescription,
      siteName: "PicSmaller",
      locale: locale.replace("-", "_"),
    },
    icons: {
      icon: "/logo.png",
    },
    other: {
      google: "notranslate",
    },
  };
}
