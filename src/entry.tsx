import { ConfigProvider } from "antd";
import { observer } from "mobx-react-lite";
import zhCN from "antd/locale/zh_CN";
import { configure } from "mobx";
import ReactDOM from "react-dom/client";
import { gstate } from "./global";
import { initHistoryLogic } from "./history";
import { ContextAction } from "./ContextAction";

const App = observer(() => {
  return (
    <ConfigProvider
      // locale={zhCN}
      theme={{
        token: {
          // borderRadius: 0,
        },
      }}
    >
      <ContextAction />
      {gstate.page}
    </ConfigProvider>
  );
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
