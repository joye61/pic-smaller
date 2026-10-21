import type { Viewport } from "next";
import "@/main.scss";
import zhCN from "@/locales/zh-CN";
import { createLocaleMetadata } from "@/seo";

export const metadata = createLocaleMetadata("zh-CN", zhCN);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7faff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export default function DefaultLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
