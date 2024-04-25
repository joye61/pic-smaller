import { ConfigProvider } from "antd";
import { observer } from "mobx-react-lite";
import { configure } from "mobx";
import ReactDOM from "react-dom/client";
import { gstate } from "./global";
import { initHistoryLogic } from "./history";
import { ContextAction } from "./ContextAction";
import { initLocaleSetting } from "./locale";

const App = observer(() => {
  return (
    <ConfigProvider
      locale={gstate.locale?.antLocale}
      theme={{
        token: {
          borderRadius: 0,
          colorPrimary: "#1da565",
          colorLink: "#1da565",
        }
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

  await initLocaleSetting();
  initHistoryLogic();

  const root = document.getElementById("root") as HTMLElement;
  ReactDOM.createRoot(root).render(<App />);
}
