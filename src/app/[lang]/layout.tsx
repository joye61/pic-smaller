import type { Viewport } from "next";
import { notFound } from "next/navigation";
import "@/main.scss";
import {
  isSupportedLocale,
  supportedLocales,
} from "@/locale-config";

export function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#007a60",
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
