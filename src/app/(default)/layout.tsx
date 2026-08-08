import type { Viewport } from "next";
import "@/main.scss";
import enUS from "@/locales/en-US";
import { createLocaleMetadata } from "@/seo";

export const metadata = createLocaleMetadata("en-US", enUS);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#007a60",
};

export default function DefaultLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US">
      <body>{children}</body>
    </html>
  );
}
