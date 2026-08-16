import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  ArrowRight,
  Check,
  Code2,
  Languages,
  Menu,
  Monitor,
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

const copy = {
  zh: {
    nav: ["在线压缩", "功能", "隐私", "开源"],
    eyebrow: "免费、开源、浏览器本地处理",
    title: "在线批量图片压缩",
    summary: "压缩、转换、缩放和裁剪，全程在浏览器本地完成。",
    intro: "批量压缩、转换、缩放和裁剪图片。所有处理都在你的浏览器中完成，文件不会上传到服务器。",
    start: "立即压缩图片",
    source: "查看源代码",
    proof: ["无需注册", "无限批量", "图片不离开设备"],
    featuresTitle: "从压缩到交付，一站完成",
    featuresIntro: "不是只减小文件体积。{brand}覆盖日常图片交付前的完整处理流程。",
    privacyTitle: "速度来自本地，安心也来自本地",
    privacyText: "图片通过 Web Worker 与 WebAssembly 在设备上并行处理。没有上传等待，也没有服务器保存副本。关闭页面，处理数据随之结束。",
    privacyPoints: ["本地处理", "并行压缩", "无文件留存", "开源可审计"],
    howTitle: "三步完成批量图片处理",
    finalTitle: "准备好让下一批图片变轻了吗？",
    finalText: "免费使用，不限数量，无需创建账号。",
    footer: "开源的浏览器端批量图片处理工具。",
    desktopNav: "桌面版",
    desktopEyebrow: "{brand}桌面版 · WINDOWS / MACOS",
    desktopTitle: "桌面版：更多格式，更强性能，更少限制",
    desktopIntro: "网页版满足日常轻量处理；桌面版面向专业需求，支持更多格式、更大文件、更快速度，并提供 AI 去背景、去水印、高清放大等网页版无法实现的能力。",
    desktopPoints: ["16+ 图片格式支持（网页版仅 6 种），含 RAW、HEIC、PSD", "无文件大小与数量限制（网页版受浏览器内存约束）", "AI 去背景 / 去水印 / 超分辨率（网页版无法实现）", "完全离线可用 + 整文件夹高速批处理"],
    desktopDownload: "下载桌面版",
    desktopTrial: "全部功能免费试用 7 天",
    desktopCompareLabel: "网页版 VS 桌面版",
    desktopStats: [["16+ vs 6", "支持格式"], ["无限制", "文件大小"], ["本机性能", "处理速度"]],
  },
  en: {
    nav: ["Compressor", "Features", "Privacy", "Open source"],
    eyebrow: "Free, open source, processed in your browser",
    title: "Batch image compressor",
    summary: "Compress, convert, resize, and crop locally in your browser.",
    intro: "Compress, convert, resize, and crop images in batches. Everything runs locally in your browser, so your files never reach a server.",
    start: "Compress images now",
    source: "View source",
    proof: ["No sign-up", "Unlimited batches", "Files stay on device"],
    featuresTitle: "From raw images to ready-to-ship",
    featuresIntro: "More than a smaller file. {brand} covers the practical image workflow before publishing or delivery.",
    privacyTitle: "Local processing is faster and more private",
    privacyText: "Web Workers and WebAssembly process images in parallel on your device. There is no upload queue and no server-side copy. Close the page and the working data is gone.",
    privacyPoints: ["Local processing", "Parallel compression", "No file retention", "Open source"],
    howTitle: "A complete batch in three steps",
    finalTitle: "Ready to make your next batch lighter?",
    finalText: "Free to use, no batch limits, no account required.",
    footer: "Open-source batch image processing in your browser.",
    desktopNav: "Desktop",
    desktopEyebrow: "{brand} DESKTOP · WINDOWS / MACOS",
    desktopTitle: "Desktop goes beyond the web — more formats, more power, fewer limits",
    desktopIntro: "The web version handles everyday quick tasks. The desktop app is built for professionals: broader format support, larger files, faster processing, and AI-powered features like background removal, watermark cleanup, and upscaling — all impossible in a browser.",
    desktopPoints: ["16+ formats including RAW, HEIC, PSD (web: only 6)", "No file size or count limits (web: constrained by browser memory)", "AI background removal / watermark cleanup / upscaling (web: unavailable)", "Full offline capability + high-speed folder batch processing"],
    desktopDownload: "Download desktop app",
    desktopTrial: "Try every feature free for 7 days",
    desktopCompareLabel: "WEB VS DESKTOP",
    desktopStats: [["16+ vs 6", "format support"], ["unlimited", "file size"], ["native", "performance"]],
  },
};

const featureData = [
  { kind: "compress", zh: ["智能压缩", "针对 JPEG、PNG、WEBP、GIF、SVG 与 AVIF 使用适合的压缩引擎。"], en: ["Smart compression", "Format-aware engines for JPEG, PNG, WEBP, GIF, SVG, and AVIF."] },
  { kind: "batch", zh: ["真正的批量处理", "文件、文件夹、拖放或粘贴都可以一次加入，统一处理。"], en: ["Real batch processing", "Add files, folders, drops, or pasted images and process them together."] },
  { kind: "convert", zh: ["格式转换", "在 JPG、PNG、WEBP 与 AVIF 之间转换，并处理透明背景。"], en: ["Format conversion", "Convert between JPG, PNG, WEBP, and AVIF with transparent fill control."] },
  { kind: "crop", zh: ["缩放与裁剪", "按宽、高、长短边、比例、固定尺寸或打印纸比例处理。"], en: ["Resize and crop", "Use width, height, long edge, ratios, exact dimensions, or paper presets."] },
  { kind: "compare", zh: ["压缩前后对比", "拖动分割线检查细节，确认体积和画质之间的平衡。"], en: ["Before-after compare", "Drag the divider to inspect detail and balance file size against quality."] },
  { kind: "worker", zh: ["并行 Worker", "多张图片在后台并行处理，页面操作保持流畅响应。"], en: ["Parallel workers", "Images process concurrently in the background while the interface stays responsive."] },
];

const FeatureGlyph = ({ kind }: { kind: string }) => (
  <div className={`${style.featureGlyph} ${style[kind]}`} aria-hidden="true">
    <span /><span /><span />
  </div>
);

const Home = observer(() => {
  useWorkerHandler();
  const [menuOpen, setMenuOpen] = useState(false);
  // Landing copy assets exist for Simplified Chinese and English.
  // zh-TW falls back to English so users never see a Simplified-Chinese
  // landing page paired with a Traditional-Chinese workspace (UI-3).
  const text = gstate.lang === "zh-CN" ? copy.zh : copy.en;
  const brandName = gstate.locale?.logo ?? "PicSmaller";

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

  // Desktop site supports zh-CN / en-US locales.
  const desktopLangPrefix =
    gstate.lang === "zh-CN" ? gstate.lang : "en";
  const desktopHomeUrl = `https://desktop.picsmaller.com/${desktopLangPrefix}/`;
  const desktopDownloadUrl = `https://desktop.picsmaller.com/${desktopLangPrefix}/download`;
  const scrollToTool = () => document.getElementById("compressor")?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className={style.page}>
      <header className={style.header}>
        <a href="#top" className={style.brand} aria-label={`${brandName} home`}><Logo title={brandName} /></a>
        <div className={style.headerTools}>
          <nav className={menuOpen ? style.navOpen : ""} aria-label="Primary navigation">
            <a className={style.desktopNav} href={desktopHomeUrl} target="_blank" rel="noreferrer"><span className={style.desktopIcon}><Monitor size={18} /></span><span>{text.desktopNav}</span><b>PRO</b></a>
          </nav>
          <div className={style.headerActions}>
            <div className={style.language}><Languages size={16} /><Select compact value={gstate.lang} ariaLabel="Language" options={langList.map((lang) => ({ value: lang.key, label: lang.label }))} onChange={changeLang} /></div>
            <button type="button" className={style.menuButton} aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className={style.hero} id="compressor">
          <div className={style.heroCopy}>
            <span className={style.eyebrow}><ShieldCheck size={16} />{text.eyebrow}</span>
            <h1>{text.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
            <p>{text.summary}</p>
          </div>
          <div className={style.workspace}>
            <div className={style.workspaceTop}>
              <div><i /><i /><i /><strong>{brandName} Workspace</strong></div>
              <button type="button" className="button" onClick={() => { homeState.showOption = true; }}><SlidersHorizontal size={17} />{gstate.locale?.optionPannel.resizeLable}</button>
            </div>
            <div className={style.workbench}>{homeState.list.size === 0 ? <UploadCard /> : <LeftContent />}<RightOption /></div>
          </div>
          <div className={style.heroDetails}>
            <p>{text.intro}</p>
            <ul className={style.heroProof}>{text.proof.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
            <a className="button" href="https://github.com/joye61/pic-smaller" target="_blank" rel="noreferrer"><Code2 size={18} />{text.source}</a>
          </div>
        </section>

        <section className={style.features} id="features">
          <div className={style.sectionHeading}><span>FEATURES</span><h2>{text.featuresTitle}</h2><p>{text.featuresIntro.replace("{brand}", brandName)}</p></div>
          <div className={style.featureGrid}>{featureData.map(({ kind, zh, en }, index) => { const item = gstate.lang === "zh-CN" ? zh : en; return <article key={item[0]}><span>0{index + 1}</span><FeatureGlyph kind={kind} /><h3>{item[0]}</h3><p>{item[1]}</p></article>; })}</div>
        </section>

        <section className={style.desktopSection} id="desktop">
          <div className={style.desktopInner}>
            <div className={style.desktopCopy}>
              <span>{text.desktopEyebrow.replace("{brand}", brandName)}</span>
              <h2>{text.desktopTitle}</h2>
              <p>{text.desktopIntro}</p>
              <ul>{text.desktopPoints.map((point) => <li key={point}><i />{point}</li>)}</ul>
              <div className={style.desktopActions}>
                <a className="button buttonAccent buttonLarge" href={desktopDownloadUrl} target="_blank" rel="noreferrer">{text.desktopDownload}<ArrowRight size={18} /></a>
                <small>{text.desktopTrial}</small>
              </div>
            </div>
            <div className={style.desktopProduct}>
              <div className={style.desktopWindow}>
                <div><i /><i /><i /><strong>{brandName} Desktop</strong><b>LOCAL AI</b></div>
                <img
                  src="https://desktop.picsmaller.com/product-workspace.png"
                  alt={`${brandName} desktop image processing workspace`}
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={400}
                  onError={(event) => {
                    (event.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className={style.desktopCompare}>
                <span>{text.desktopCompareLabel}</span>
                <dl>{text.desktopStats.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl>
              </div>
            </div>
          </div>
        </section>

        <section className={style.how}>
          <div className={style.sectionHeading}><span>WORKFLOW</span><h2>{text.howTitle}</h2></div>
          <ol>
            {(gstate.lang === "zh-CN" ? [["添加图片", "选择文件或文件夹，也可以拖放和粘贴。"], ["统一设置", "选择质量、格式、尺寸和裁剪方式。"], ["检查并下载", "查看节省比例，逐张下载或打包保存。"]] : [["Add images", "Choose files or folders, or simply drop and paste."], ["Set once", "Choose quality, format, dimensions, and crop behavior."], ["Review and download", "Inspect savings, then download files or one ZIP."]]).map((step, index) => <li key={step[0]}><b>{index + 1}</b><div><h3>{step[0]}</h3><p>{step[1]}</p></div></li>)}
          </ol>
        </section>

        <section className={style.privacy} id="privacy">
          <div><span className={style.eyebrow}><ShieldCheck size={16} />PRIVACY BY DESIGN</span><h2>{text.privacyTitle}</h2><p>{text.privacyText}</p><ul>{text.privacyPoints.map((point) => <li key={point}><Check size={16} />{point}</li>)}</ul></div>
          <div className={style.privacyVisual}><ShieldCheck size={48} /><strong>0 files uploaded</strong><span>Browser only / Web Worker / WASM</span></div>
        </section>

        <section className={style.finalCta}><h2>{text.finalTitle}</h2><p>{text.finalText}</p><button type="button" className="button buttonAccent buttonLarge" onClick={scrollToTool}>{text.start}<ArrowRight size={18} /></button></section>
      </main>

      <footer className={style.footer}><Logo title={brandName} /><p>{text.footer}</p><div><a href="#compressor">{text.nav[0]}</a><a href={desktopDownloadUrl} target="_blank" rel="noreferrer">{text.desktopNav}</a><a href="https://github.com/joye61/pic-smaller" target="_blank" rel="noreferrer">GitHub</a><span>MIT License</span></div></footer>
      {homeState.compareId !== null && <Compare />}
    </div>
  );
});

export default Home;
