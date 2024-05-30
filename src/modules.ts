import type { LocaleData } from "@/type";
export const modules = import.meta.glob("@/pages/**/index.tsx");
export const locales = import.meta.glob<{ default: LocaleData }>(
  "@/locales/*.ts",
);
