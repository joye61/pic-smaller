"use client";

import { useEffect, useState } from "react";
import { configure } from "mobx";
import { gstate } from "./global";
import Home from "./views/home";
import { Loading } from "./components/Loading";
import type { SupportedLocale } from "./locale-config";
import type { LocaleData } from "./type";
import { localeStorageKey } from "./storage";

type ClientAppProps = {
  lang: SupportedLocale;
  locale: LocaleData;
};

export default function ClientApp({ lang, locale }: ClientAppProps) {
  useState(() => {
    gstate.lang = lang;
    gstate.locale = locale;
  });

  useEffect(() => {
    configure({
      enforceActions: "never",
      useProxies: "ifavailable",
    });

    document.documentElement.lang = lang;
    window.localStorage.setItem(localeStorageKey, lang);
  }, [lang]);

  return (
    <>
      <Home />
      {gstate.loading && <Loading />}
    </>
  );
}
