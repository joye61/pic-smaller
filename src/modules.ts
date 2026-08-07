import type { LocaleData } from "@/type";

type PageModule = { default: React.FC };
type LocaleModule = { default: LocaleData };

export const modules: Record<string, () => Promise<PageModule>> = {
  "/src/pages/home/index.tsx": () => import("@/views/home"),
  "/src/pages/error404/index.tsx": () => import("@/views/error404"),
};

export const locales: Record<string, () => Promise<LocaleModule>> = {
  "/src/locales/en-US.ts": () => import("@/locales/en-US"),
  "/src/locales/es-ES.ts": () => import("@/locales/es-ES"),
  "/src/locales/fa-IR.ts": () => import("@/locales/fa-IR"),
  "/src/locales/fr-FR.ts": () => import("@/locales/fr-FR"),
  "/src/locales/ja-JP.ts": () => import("@/locales/ja-JP"),
  "/src/locales/ko-KR.ts": () => import("@/locales/ko-KR"),
  "/src/locales/tr-TR.ts": () => import("@/locales/tr-TR"),
  "/src/locales/zh-CN.ts": () => import("@/locales/zh-CN"),
  "/src/locales/zh-TW.ts": () => import("@/locales/zh-TW"),
};
