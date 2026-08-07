import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { locales, modules } from "./modules";
import { initRouter } from "./router";
import { gstate } from "./global";
import { Indicator } from "./components/Indicator";

const loadResources = () => {
  const loadList: Array<Promise<any>> = [
    import("jszip"),
    fetch("/wasm/gif.wasm"),
  ];
  const langs = Object.values(locales);
  const pages = Object.values(modules);
  for (const load of [...langs, ...pages]) {
    loadList.push(load());
  }
  return Promise.all(loadList);
};

const useInit = () => {
  useEffect(() => {
    (async () => {
      await loadResources();
      initRouter();
    })();
  }, []);
};

export const Initial = observer(() => {
  useInit();

  return (
    <div className="__initial">
      <div>
        <Indicator size="large" />
        <span>{gstate.locale?.initial}</span>
      </div>
    </div>
  );
});
