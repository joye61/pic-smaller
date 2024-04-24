import { ConfigProvider } from "antd";
import { observer } from "mobx-react-lite";
import zhCN from "antd/locale/zh_CN";
import { configure } from "mobx";
import ReactDOM from "react-dom/client";
import { gstate } from "./global";
import { initHistoryLogic } from "./history";

const App = observer(() => {
  return <ConfigProvider locale={zhCN}>{gstate.page}</ConfigProvider>;
});

export async function runApp() {
  configure({
    enforceActions: "never",
    useProxies: "ifavailable",
  });

  initHistoryLogic();

  const root = document.getElementById("root") as HTMLElement;
  ReactDOM.createRoot(root).render(<App />);
}
