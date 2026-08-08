import type { MetadataRoute } from "next";
import {
  getLocalePath,
  siteUrl,
  supportedLocales,
} from "@/locale-config";

export const dynamic = "force-static";

const languages = Object.fromEntries(
  [
    ...supportedLocales.map((locale) => [
      locale,
      `${siteUrl}${getLocalePath(locale)}`,
    ]),
    ["x-default", `${siteUrl}/en-US/`],
  ],
);

export default function sitemap(): MetadataRoute.Sitemap {
  return supportedLocales.map((locale) => ({
    url: `${siteUrl}${getLocalePath(locale)}`,
    changeFrequency: "monthly",
    priority: locale === "en-US" || locale === "zh-CN" ? 1 : 0.8,
    alternates: { languages },
  }));
}
