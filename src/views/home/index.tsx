import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  ArrowRight,
  Check,
  Code2,
  Languages,
  Menu,
  MessageCircle,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import style from "./index.module.scss";
import { Logo } from "@/components/Logo";
import { UploadCard } from "@/components/UploadCard";
import { Compare } from "@/components/Compare";
import { gstate } from "@/global";
import { changeLang, langList } from "@/locale";
import { homeState } from "@/states/home";
import { createImageList, useWorkerHandler } from "@/engines/transform";
import { getFilesFromClipboard, hasImageInClipboard } from "@/functions";
import { LeftContent } from "./LeftContent";
import { RightOption } from "./RightOption";
import { Select } from "@/components/Select";
import { ThemeToggle } from "@/components/ThemeToggle";

const sourceUrl = "https://github.com/ArcaneLune/pic-smaller";
const issuesUrl = `${sourceUrl}/issues`;

const copy = {
  zh: {
    nav: ["在线处理", "功能", "隐私说明", "反馈"],
    eyebrow: "免费使用 · 图片不上传",
    title: "让每一张图片轻一点",
    summary: "批量压缩、转换、缩放和裁剪，全程只在你的浏览器中完成。",
    intro:
      "批量压缩、转换、缩放和裁剪图片。所有处理都在你的浏览器中完成，文件不会上传到服务器。",
    start: "立即压缩图片",
    source: "查看源代码",
    feedback: "问题反馈",
    privacyLink: "阅读隐私与项目说明",
    lightTheme: "切换到日间模式",
    darkTheme: "切换到夜间模式",
    workspace: "图片工作台",
    proof: ["无需注册", "无限批量", "图片不离开设备"],
    featuresTitle: "从压缩到交付，一站完成",
    featuresIntro:
      "不是只减小文件体积。{brand}覆盖日常图片交付前的完整处理流程。",
    privacyTitle: "速度来自本地，安心也来自本地",
    privacyText:
      "图片通过 Web Worker 与 WebAssembly 在设备上并行处理。没有上传等待，也没有服务器保存副本。关闭页面，处理数据随之结束。",
    privacyPoints: ["本地处理", "并行压缩", "无文件留存", "开源可审计"],
    howTitle: "三步完成批量图片处理",
    finalTitle: "准备好让下一批图片变轻了吗？",
    finalText: "免费使用，不限数量，无需创建账号。",
    footer: "开源、无账号、图片不上传的浏览器端批量图片工具。",
    uploaded: "0 个文件上传",
    localStack: "仅浏览器 / Web Worker / WASM",
  },
  en: {
    nav: ["Workspace", "Features", "Privacy", "Feedback"],
    eyebrow: "Free to use · Nothing uploaded",
    title: "Make every image lighter",
    summary:
      "Compress, convert, resize, and crop in batches without leaving your browser.",
    intro:
      "Compress, convert, resize, and crop images in batches. Everything runs locally in your browser, so your files never reach a server.",
    start: "Compress images now",
    source: "View source",
    feedback: "Report an issue",
    privacyLink: "Read privacy and project notes",
    lightTheme: "Switch to light theme",
    darkTheme: "Switch to dark theme",
    workspace: "Image workspace",
    proof: ["No sign-up", "Unlimited batches", "Files stay on device"],
    featuresTitle: "From raw images to ready-to-ship",
    featuresIntro:
      "More than a smaller file. {brand} covers the practical image workflow before publishing or delivery.",
    privacyTitle: "Local processing is faster and more private",
    privacyText:
      "Web Workers and WebAssembly process images in parallel on your device. There is no upload queue and no server-side copy. Close the page and the working data is gone.",
    privacyPoints: [
      "Local processing",
      "Parallel compression",
      "No file retention",
      "Open source",
    ],
    howTitle: "A complete batch in three steps",
    finalTitle: "Ready to make your next batch lighter?",
    finalText: "Free to use, no batch limits, no account required.",
    footer: "Open source, account-free batch image tools with no file uploads.",
    uploaded: "0 files uploaded",
    localStack: "Browser only / Web Worker / WASM",
  },
};

const featureData = [
  {
    kind: "compress",
    zh: [
      "智能压缩",
      "针对 JPEG、PNG、WEBP、GIF、SVG 与 AVIF 使用适合的压缩引擎。",
    ],
    en: [
      "Smart compression",
      "Format-aware engines for JPEG, PNG, WEBP, GIF, SVG, and AVIF.",
    ],
  },
  {
    kind: "batch",
    zh: [
      "真正的批量处理",
      "文件、文件夹、拖放或粘贴都可以一次加入，统一处理。",
    ],
    en: [
      "Real batch processing",
      "Add files, folders, drops, or pasted images and process them together.",
    ],
  },
  {
    kind: "convert",
    zh: ["格式转换", "在 JPG、PNG、WEBP 与 AVIF 之间转换，并处理透明背景。"],
    en: [
      "Format conversion",
      "Convert between JPG, PNG, WEBP, and AVIF with transparent fill control.",
    ],
  },
  {
    kind: "crop",
    zh: ["缩放与裁剪", "按宽、高、长短边、比例、固定尺寸或打印纸比例处理。"],
    en: [
      "Resize and crop",
      "Use width, height, long edge, ratios, exact dimensions, or paper presets.",
    ],
  },
  {
    kind: "compare",
    zh: ["压缩前后对比", "拖动分割线检查细节，确认体积和画质之间的平衡。"],
    en: [
      "Before-after compare",
      "Drag the divider to inspect detail and balance file size against quality.",
    ],
  },
  {
    kind: "worker",
    zh: ["并行 Worker", "多张图片在后台并行处理，页面操作保持流畅响应。"],
    en: [
      "Parallel workers",
      "Images process concurrently in the background while the interface stays responsive.",
    ],
  },
];

const FeatureGlyph = ({ kind }: { kind: string }) => (
  <div className={`${style.featureGlyph} ${style[kind]}`} aria-hidden="true">
    <span />
    <span />
    <span />
  </div>
);

const Home = observer(() => {
  useWorkerHandler();
  const [menuOpen, setMenuOpen] = useState(false);
  const text = gstate.lang === "zh-CN" ? copy.zh : copy.en;
  const brandName = gstate.locale?.logo ?? "LunePic";

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      if (!hasImageInClipboard(event)) return;
      // Ignore pastes inside editable elements (inputs, textareas,
      // contenteditable) so normal text editing is not hijacked.
      const target = event.target as HTMLElement | null;
      const editable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        Boolean(target?.isContentEditable);
      if (editable) return;
      event.preventDefault();
      const files = await getFilesFromClipboard(event);
      if (files.length > 0) createImageList(files);
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  const privacyUrl = `/${gstate.lang}/privacy`;
  const scrollToTool = () =>
    document
      .getElementById("compressor")
      ?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className={style.page}>
      <header className={style.header}>
        <a href="#top" className={style.brand} aria-label={`${brandName} home`}>
          <Logo title={brandName} />
        </a>
        <div className={style.headerTools}>
          <nav
            className={menuOpen ? style.navOpen : ""}
            aria-label="Primary navigation"
          >
            <a href="#compressor">{text.nav[0]}</a>
            <a href="#features">{text.nav[1]}</a>
            <a href={privacyUrl}>{text.nav[2]}</a>
            <a href={issuesUrl} target="_blank" rel="noreferrer">
              {text.nav[3]}
            </a>
          </nav>
          <div className={style.headerActions}>
            <ThemeToggle
              lightLabel={text.lightTheme}
              darkLabel={text.darkTheme}
            />
            <div className={style.language}>
              <Languages size={16} />
              <Select
                compact
                value={gstate.lang}
                ariaLabel="Language"
                options={langList.map((lang) => ({
                  value: lang.key,
                  label: lang.label,
                }))}
                onChange={changeLang}
              />
            </div>
            <button
              type="button"
              className={style.menuButton}
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className={style.hero} id="compressor">
          <div className={style.heroCopy}>
            <span className={style.eyebrow}>
              <ShieldCheck size={16} />
              {text.eyebrow}
            </span>
            <h1>
              {text.title.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p>{text.summary}</p>
          </div>
          <div className={style.workspace}>
            <div className={style.workspaceTop}>
              <div>
                <i />
                <i />
                <i />
                <strong>
                  {brandName} · {text.workspace}
                </strong>
              </div>
              <button
                type="button"
                className="button"
                onClick={() => {
                  homeState.showOption = true;
                }}
              >
                <SlidersHorizontal size={17} />
                {gstate.locale?.optionPannel.resizeLable}
              </button>
            </div>
            <div className={style.workbench}>
              {homeState.list.size === 0 ? <UploadCard /> : <LeftContent />}
              <RightOption />
            </div>
          </div>
          <div className={style.heroDetails}>
            <p>{text.intro}</p>
            <ul className={style.heroProof}>
              {text.proof.map((item) => (
                <li key={item}>
                  <Check size={15} />
                  {item}
                </li>
              ))}
            </ul>
            <a
              className="button"
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Code2 size={18} />
              {text.source}
            </a>
          </div>
        </section>

        <section className={style.features} id="features">
          <div className={style.sectionHeading}>
            <span>FEATURES</span>
            <h2>{text.featuresTitle}</h2>
            <p>{text.featuresIntro.replace("{brand}", brandName)}</p>
          </div>
          <div className={style.featureGrid}>
            {featureData.map(({ kind, zh, en }, index) => {
              const item = gstate.lang === "zh-CN" ? zh : en;
              return (
                <article key={item[0]}>
                  <span>0{index + 1}</span>
                  <FeatureGlyph kind={kind} />
                  <h3>{item[0]}</h3>
                  <p>{item[1]}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className={style.how}>
          <div className={style.sectionHeading}>
            <span>WORKFLOW</span>
            <h2>{text.howTitle}</h2>
          </div>
          <ol>
            {(gstate.lang === "zh-CN"
              ? [
                  ["添加图片", "选择文件或文件夹，也可以拖放和粘贴。"],
                  ["统一设置", "选择质量、格式、尺寸和裁剪方式。"],
                  ["检查并下载", "查看节省比例，逐张下载或打包保存。"],
                ]
              : [
                  [
                    "Add images",
                    "Choose files or folders, or simply drop and paste.",
                  ],
                  [
                    "Set once",
                    "Choose quality, format, dimensions, and crop behavior.",
                  ],
                  [
                    "Review and download",
                    "Inspect savings, then download files or one ZIP.",
                  ],
                ]
            ).map((step, index) => (
              <li key={step[0]}>
                <b>{index + 1}</b>
                <div>
                  <h3>{step[0]}</h3>
                  <p>{step[1]}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={style.privacy} id="privacy">
          <div>
            <span className={style.eyebrow}>
              <ShieldCheck size={16} />
              PRIVACY BY DESIGN
            </span>
            <h2>{text.privacyTitle}</h2>
            <p>{text.privacyText}</p>
            <ul>
              {text.privacyPoints.map((point) => (
                <li key={point}>
                  <Check size={16} />
                  {point}
                </li>
              ))}
            </ul>
            <a className={style.privacyLink} href={privacyUrl}>
              {text.privacyLink}
              <ArrowRight size={16} />
            </a>
          </div>
          <div className={style.privacyVisual}>
            <ShieldCheck size={48} />
            <strong>{text.uploaded}</strong>
            <span>{text.localStack}</span>
          </div>
        </section>

        <section className={style.finalCta}>
          <h2>{text.finalTitle}</h2>
          <p>{text.finalText}</p>
          <button
            type="button"
            className="button buttonAccent buttonLarge"
            onClick={scrollToTool}
          >
            {text.start}
            <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer className={style.footer}>
        <Logo title={brandName} />
        <p>{text.footer}</p>
        <div>
          <a href={privacyUrl}>
            <ShieldCheck size={14} />
            {text.nav[2]}
          </a>
          <a href={sourceUrl} target="_blank" rel="noreferrer">
            <Code2 size={14} />
            GitHub
          </a>
          <a href={issuesUrl} target="_blank" rel="noreferrer">
            <MessageCircle size={14} />
            {text.feedback}
          </a>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
            鲁ICP备2025155779号-3
          </a>
          <span>MIT License</span>
        </div>
      </footer>
      {homeState.compareId !== null && <Compare />}
    </div>
  );
});

export default Home;
