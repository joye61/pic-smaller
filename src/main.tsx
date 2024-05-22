import "./main.scss";
import { configure } from "mobx";
import ReactDOM from "react-dom/client";
import { initLang } from "./locale";
import { App } from "./App";

window.onload = async () => {
  await initLang();
  configure({
    enforceActions: "never",
    useProxies: "ifavailable",
  });

  const root = document.getElementById("root")!;
  ReactDOM.createRoot(root).render(<App />);
};
