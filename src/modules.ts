import type { LocaleData } from "@/type";
export const modules = import.meta.glob<{ default: React.FC }>(
  "@/pages/**/index.tsx",
);
export const locales = import.meta.glob<{ default: LocaleData }>(
  "@/locales/*.ts",
);
