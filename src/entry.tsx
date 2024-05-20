import { ConfigProvider } from "antd";
import { observer } from "mobx-react-lite";
import { configure } from "mobx";
import ReactDOM from "react-dom/client";
import { gstate } from "./global";
import { ContextAction } from "./ContextAction";
import { initLang } from "./locale";
import { Analytics } from "@vercel/analytics/react";
import { Loading } from "./components/Loading";

const App = observer(() => {
  return (
    <ConfigProvider
      locale={gstate.locale?.antLocale}
      theme={{
        token: {
          colorPrimary: "#1da565",
          colorLink: "#1da565",
          colorSuccess: "#1da565",
        },
      }}
    >
      <ContextAction />
      <Analytics />
      {gstate.page}
      {gstate.loading && <Loading />}
    </ConfigProvider>
  );
});

export async function runApp() {
  configure({
    enforceActions: "never",
    useProxies: "ifavailable",
  });

  await initLang();

  const root = document.getElementById("root")!
  ReactDOM.createRoot(root).render(<App />);
}
