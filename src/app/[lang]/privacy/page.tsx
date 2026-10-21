import type { Metadata } from "next";
import { ArrowLeft, Code2, MessageCircle, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { getLocalePath, isSupportedLocale, siteUrl } from "@/locale-config";
import style from "./privacy.module.scss";

const sourceUrl = "https://github.com/ArcaneLune/pic-smaller";

const copy = {
  "zh-CN": {
    title: "隐私与项目说明",
    description:
      "了解 LunePic 如何在浏览器本地处理图片，以及本项目的开源来源与反馈渠道。",
    back: "返回图片工作台",
    privacyTitle: "图片只在你的设备上处理",
    privacyBody: [
      "LunePic 使用浏览器提供的 Canvas、Web Worker、WebAssembly 与本地编解码能力处理图片。你选择、拖入或粘贴的图片不会发送到 LunePic 服务器。",
      "网站无需注册，不设置身份 Cookie，也不接入访客行为分析脚本。浏览器本地存储仅用于保存主题、语言和工具参数。清除站点数据即可删除这些设置。",
      "服务器会按照常规网站运维保留有限期的 Nginx 访问与错误日志，其中可能包含访问时间、请求路径、IP 地址和浏览器标识，但不包含你的图片内容。",
    ],
    sourceTitle: "开源与来源",
    sourceBody:
      "LunePic 基于 Pic Smaller 开源项目演进，继续遵循 MIT License。品牌、界面与部署由 ArcaneLune Fork 维护，图像处理能力保持浏览器本地执行。",
    source: "查看 LunePic 源码",
    upstream: "查看上游项目",
    feedbackTitle: "问题反馈",
    feedbackBody:
      "如果遇到格式兼容、页面显示或处理结果问题，请在 GitHub Issues 中提交可复现信息。请勿上传包含隐私内容的原始图片。",
    feedback: "前往 GitHub Issues",
    filing: "鲁ICP备2025155779号-3",
  },
  "en-US": {
    title: "Privacy and project notes",
    description:
      "Learn how LunePic processes images locally and how to review the open-source project or report a problem.",
    back: "Back to the image workspace",
    privacyTitle: "Your images stay on your device",
    privacyBody: [
      "LunePic processes images with browser APIs, Canvas, Web Workers, WebAssembly, and local codecs. Files you select, drop, or paste are never sent to the LunePic server.",
      "No account is required. LunePic sets no identity cookies and includes no visitor-behavior analytics. Local browser storage is used only for theme, language, and tool preferences; clearing site data removes those settings.",
      "For routine operations, the server keeps short-lived Nginx access and error logs that can contain access time, request path, IP address, and browser identifier. They never contain your image files.",
    ],
    sourceTitle: "Open source and attribution",
    sourceBody:
      "LunePic is derived from the open-source Pic Smaller project and remains available under the MIT License. The ArcaneLune fork maintains the brand, interface, and deployment while preserving local browser processing.",
    source: "View LunePic source",
    upstream: "View upstream project",
    feedbackTitle: "Feedback",
    feedbackBody:
      "For format compatibility, display, or processing issues, open a GitHub issue with reproducible details. Do not upload private source images.",
    feedback: "Open GitHub Issues",
    filing: "鲁ICP备2025155779号-3",
  },
} as const;

type PrivacyPageProps = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return [{ lang: "zh-CN" }, { lang: "en-US" }];
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();
  const text = copy[lang];
  const path = `${getLocalePath(lang)}/privacy`;
  return {
    metadataBase: new URL(siteUrl),
    title: `${text.title} | LunePic`,
    description: text.description,
    alternates: {
      canonical: path,
      languages: {
        "zh-CN": "/zh-CN/privacy",
        "en-US": "/en-US/privacy",
        "x-default": "/zh-CN/privacy",
      },
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();
  const text = copy[lang];

  return (
    <main className={style.page}>
      <header>
        <a className={style.brand} href={getLocalePath(lang)} aria-label="LunePic home">
          <img src="/lunepic-logo.svg" alt="" width="40" height="40" />
          <strong>LunePic</strong>
        </a>
        <a className="button" href={getLocalePath(lang)}>
          <ArrowLeft size={16} />
          {text.back}
        </a>
      </header>

      <section className={style.hero}>
        <ShieldCheck size={34} />
        <h1>{text.title}</h1>
        <p>{text.description}</p>
      </section>

      <div className={style.content}>
        <section>
          <h2>{text.privacyTitle}</h2>
          {text.privacyBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
        <section>
          <h2>{text.sourceTitle}</h2>
          <p>{text.sourceBody}</p>
          <div className={style.actions}>
            <a
              className="button buttonPrimary"
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Code2 size={17} />
              {text.source}
            </a>
            <a
              className="button"
              href="https://github.com/joye61/pic-smaller"
              target="_blank"
              rel="noreferrer"
            >
              {text.upstream}
            </a>
          </div>
        </section>
        <section>
          <h2>{text.feedbackTitle}</h2>
          <p>{text.feedbackBody}</p>
          <a
            className="button"
            href={`${sourceUrl}/issues`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} />
            {text.feedback}
          </a>
        </section>
      </div>

      <footer>
        <span>© {new Date().getUTCFullYear()} LunePic · MIT License</span>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
          {text.filing}
        </a>
      </footer>
    </main>
  );
}
