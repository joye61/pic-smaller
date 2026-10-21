import type { LocaleData } from "@/type";

type PageModule = { default: React.FC };
type LocaleModule = { default: LocaleData };

export const modules: Record<string, () => Promise<PageModule>> = {
  "/src/pages/home/index.tsx": () => import("@/views/home"),
  "/src/pages/error404/index.tsx": () => import("@/views/error404"),
};

export const locales: Record<string, () => Promise<LocaleModule>> = {
  "/src/locales/en-US.ts": () => import("@/locales/en-US"),
  "/src/locales/zh-CN.ts": () => import("@/locales/zh-CN"),
};
