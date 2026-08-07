import type { Metadata, Viewport } from "next";
import "@/main.scss";

export const metadata: Metadata = {
  title:
    "PicSmaller - Compress JPEG, PNG, WEBP, AVIF, SVG and GIF images intelligently",
  description:
    "Compress JPEG, PNG, WEBP, AVIF, SVG and GIF images securely in your browser.",
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#007a60",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}