"use client";

import { useEffect, useState } from "react";
import { configure } from "mobx";
import { initLang } from "./locale";
import { App } from "./App";

export default function ClientApp() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    configure({
      enforceActions: "never",
      useProxies: "ifavailable",
    });

    initLang().then(() => setInitialized(true));
  }, []);

  return initialized ? <App /> : null;
}