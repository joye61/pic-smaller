import type { MetadataRoute } from "next";
import { getLocalePath, siteUrl, supportedLocales } from "@/locale-config";

export const dynamic = "force-static";

const languages = Object.fromEntries([
  ...supportedLocales.map((locale) => [
    locale,
    `${siteUrl}${getLocalePath(locale)}`,
  ]),
    ["x-default", `${siteUrl}/zh-CN`],
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const homePages: MetadataRoute.Sitemap = supportedLocales.map((locale) => ({
    url: `${siteUrl}${getLocalePath(locale)}`,
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));

  const privacyLanguages = {
    "zh-CN": `${siteUrl}/zh-CN/privacy`,
    "en-US": `${siteUrl}/en-US/privacy`,
    "x-default": `${siteUrl}/zh-CN/privacy`,
  };
  const privacyPages: MetadataRoute.Sitemap = supportedLocales.map(
    (locale) => ({
    url: `${siteUrl}${getLocalePath(locale)}/privacy`,
      changeFrequency: "yearly",
      priority: 0.4,
      alternates: { languages: privacyLanguages },
    }),
  );

  return [...homePages, ...privacyPages];
}
