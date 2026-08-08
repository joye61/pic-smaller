import ClientApp from "@/ClientApp";
import type { SupportedLocale } from "@/locale-config";
import type { LocaleData } from "@/type";

type ClientPageProps = {
  lang: SupportedLocale;
  locale: LocaleData;
};

export default function ClientPage({ lang, locale }: ClientPageProps) {
  return <ClientApp lang={lang} locale={locale} />;
}