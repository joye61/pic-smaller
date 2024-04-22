import type { Metadata } from "next";
import "antd/dist/reset.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

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
      <body>
        <AntdRegistry>
          <ConfigProvider
            locale={zhCN}
            theme={{
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
