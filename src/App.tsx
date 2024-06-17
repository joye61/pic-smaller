import { ConfigProvider } from "antd";
import { observer } from "mobx-react-lite";
import { gstate } from "./global";
import { ContextAction } from "./ContextAction";
import { Analytics } from "@vercel/analytics/react";
import { Loading } from "./components/Loading";
import { useResponse } from "./media";
import { useEffect } from "react";

function useMobileVConsole() {
  const { isMobile } = useResponse();
  useEffect(() => {
    if (!isMobile || !import.meta.env.DEV) return;
    let vConsole: any = null;
    import("vconsole").then((result) => {
      vConsole = new result.default({ theme: "dark" });
    });
    return () => vConsole?.destroy();
  }, [isMobile]);
}

const configProviderProps = {
  locale: gstate.locale?.antLocale,
  theme: {
    token: {
      colorPrimary: "#1da565",
      colorLink: "#1da565",
      colorSuccess: "#1da565",
    },
  },
};

export const App = observer(() => {
  useMobileVConsole();

  return (
    <ConfigProvider {...configProviderProps}>
      <ContextAction />
      {import.meta.env.MODE === "production" && <Analytics />}
      {gstate.page}
      {gstate.loading && <Loading />}
    </ConfigProvider>
  );
});
