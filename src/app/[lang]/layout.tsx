import type { Metadata, Viewport } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import "@/main.scss";
import {
  isSupportedLocale,
  isLegacyLocale,
  supportedLocales,
} from "@/locale-config";
import { metadataBase } from "@/seo";

export const metadata: Metadata = { metadataBase };

export function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7faff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (isLegacyLocale(lang)) permanentRedirect("/en-US");
  if (!isSupportedLocale(lang)) notFound();

  return (
    <html lang={lang} data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("lunepic-theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}',
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
