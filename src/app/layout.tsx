import type { Metadata, Viewport } from "next";
import "@/main.scss";

export const metadata: Metadata = {
  title:
    "PicSmaller - Compress JPEG, PNG, WEBP, AVIF, HEIC, SVG and GIF images intelligently",
  description:
    "Compress JPEG, PNG, WEBP, AVIF, HEIC, SVG and GIF images securely in your browser. Batch resize, crop, and convert formats — all processed locally.",
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
    <html lang="en-US">
      <body>{children}</body>
    </html>
  );
}