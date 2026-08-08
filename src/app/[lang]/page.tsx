import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientPage from "../ClientPage";
import { isSupportedLocale } from "@/locale-config";
import { getLocaleData } from "@/locale-data";
import { createLocaleMetadata } from "@/seo";

function assertLocale(lang: string) {
  if (!isSupportedLocale(lang)) notFound();
  return lang;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = assertLocale(lang);
  const localeData = await getLocaleData(locale);
  return createLocaleMetadata(locale, localeData);
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const locale = assertLocale(lang);
  const localeData = await getLocaleData(locale);
  return <ClientPage lang={locale} locale={localeData} />;
}
