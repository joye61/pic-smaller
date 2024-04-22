import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PicSmaller – Compress WebP, PNG and JPEG images intelligently",
  description:
    "Free online image compressor for faster websites! Reduce the file size of your WEBP, JPEG, and PNG images with PicSamller’s smart lossy compression engine. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            locale={zhCN}
            theme={{
              // algorithm: theme.compactAlgorithm,
              token: {
                borderRadius: 0,
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
