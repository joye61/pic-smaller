import { ImageResponse } from "next/og";
import { isSupportedLocale } from "@/locale-config";

export const alt = "LunePic — browser-first batch image processing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OpenGraphImageProps = { params: Promise<{ lang: string }> };

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { lang } = await params;
  const locale = isSupportedLocale(lang) ? lang : "zh-CN";
  const tagline =
    locale === "zh-CN"
      ? "批量压缩、转换、缩放与裁剪"
      : "Batch compress, convert, resize, and crop";
  const privacy =
    locale === "zh-CN"
      ? "图片只在浏览器本地处理"
      : "Images stay in your browser";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f7faff 0%, #dbeafe 100%)",
          color: "#0f172a",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: 1010,
            display: "flex",
            alignItems: "center",
            gap: 64,
            padding: "72px 80px",
            border: "2px solid #bfdbfe",
            borderRadius: 36,
            background: "rgba(255,255,255,.88)",
            boxShadow: "0 28px 80px rgba(37,99,235,.16)",
          }}
        >
          <div
            style={{
              width: 220,
              height: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 52,
              background: "#eff6ff",
              color: "#2563eb",
              fontSize: 142,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 142,
                height: 142,
                display: "flex",
                borderRadius: "50%",
                background: "#2563eb",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 44,
                  width: 112,
                  height: 112,
                  display: "flex",
                  borderRadius: "50%",
                  background: "#eff6ff",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 4,
                  bottom: 15,
                  width: 82,
                  height: 64,
                  display: "flex",
                  border: "7px solid #0f172a",
                  borderRadius: 12,
                  background: "#ffffff",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3 }}>
              LunePic
            </div>
            <div style={{ marginTop: 18, fontSize: 34, color: "#334155" }}>
              {tagline}
            </div>
            <div style={{ marginTop: 16, fontSize: 24, color: "#64748b" }}>
              {privacy}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
