"use client";

import { useEffect } from "react";
import getUserLocale from "get-user-locale";
import {
  defaultLocale,
  getLocalePath,
  isSupportedLocale,
  supportedLocales,
  type SupportedLocale,
} from "@/locale-config";

function resolveLocale(locale: string | null): SupportedLocale {
  if (!locale) return defaultLocale;
  if (isSupportedLocale(locale)) return locale;

  const language = locale.split("-")[0].toLowerCase();
  return supportedLocales.find(
    (supported) => supported.split("-")[0].toLowerCase() === language,
  ) ?? defaultLocale;
}

export default function RootLocaleRedirect() {
  useEffect(() => {
    const savedLocale = window.localStorage.getItem("Pic-Smaller-Locale");
    const locale = resolveLocale(savedLocale ?? getUserLocale());
    window.location.replace(getLocalePath(locale));
  }, []);

  return null;
}
