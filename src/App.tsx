import { observer } from "mobx-react-lite";
import { gstate } from "./global";
import { Analytics } from "@vercel/analytics/react";
import { Loading } from "./components/Loading";
import { useResponse } from "./media";
import { useEffect } from "react";

function useMobileVConsole() {
  const { isMobile } = useResponse();
  useEffect(() => {
    if (!isMobile || process.env.NODE_ENV !== "development") return;
    let vConsole: any = null;
    import("vconsole").then((result) => {
      vConsole = new result.default({ theme: "dark" });
    });
    return () => vConsole?.destroy();
  }, [isMobile]);
}

export const App = observer(() => {
  useMobileVConsole();
  const enableAnalytics =
    process.env.NODE_ENV === "production" &&
    !["localhost", "127.0.0.1"].includes(window.location.hostname);

  return (
    <>
      {enableAnalytics && <Analytics />}
      {gstate.page}
      {gstate.loading && <Loading />}
    </>
  );
});
