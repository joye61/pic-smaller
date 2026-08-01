import { ConfigProvider, App as AntApp } from "antd";
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

export const App = observer(() => {
  useMobileVConsole();

  return (
    <ConfigProvider
      locale={gstate.locale?.antLocale}
      theme={{
        token: {
          borderRadius: 6,
          colorPrimary: "#087f60",
          colorLink: "#087357",
          colorSuccess: "#087f60",
          colorError: "#c53b3f",
          colorWarning: "#a66b00",
          colorText: "#17211e",
          colorTextSecondary: "#5e6b67",
          colorTextTertiary: "#87918e",
          colorBorder: "#d7dfdc",
          colorBorderSecondary: "#e7ecea",
          colorBgBase: "#ffffff",
          colorBgLayout: "#f3f6f5",
          colorBgContainer: "#ffffff",
          colorBgElevated: "#ffffff",
          controlHeight: 40,
          fontFamily:
            '"Source Sans 3", "Segoe UI", "Microsoft YaHei", sans-serif',
          boxShadow: "none",
          boxShadowSecondary: "none",
        },
        components: {
          Button: {
            fontWeight: 600,
            primaryShadow: "none",
            defaultShadow: "none",
            dangerShadow: "none",
            defaultBg: "#ffffff",
            defaultBorderColor: "#cbd5d1",
            defaultColor: "#26332f",
          },
          Table: {
            headerBg: "#f3f6f5",
            headerColor: "#3f4d48",
            rowHoverBg: "#f3f8f6",
            borderColor: "#e1e7e4",
          },
          Drawer: {
            colorBgElevated: "#ffffff",
          },
          Select: {
            selectorBg: "#ffffff",
            optionSelectedBg: "#e7f2ee",
          },
          Slider: {
            railBg: "#dce3e0",
            railHoverBg: "#ccd6d2",
            trackBg: "#087f60",
            trackHoverBg: "#066e53",
            handleColor: "#087f60",
          },
        },
      }}
    >
      <AntApp>
        <ContextAction />
      </AntApp>
      {import.meta.env.MODE === "production" && <Analytics />}
      {gstate.page}
      {gstate.loading && <Loading />}
    </ConfigProvider>
  );
});
