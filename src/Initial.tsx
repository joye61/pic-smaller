import { observer } from "mobx-react-lite";
import { Flex, Typography } from "antd";
import { useEffect } from "react";
import { locales, modules } from "./modules";
import { initHistoryLogic } from "./history";
import { gstate } from "./global";
import { Indicator } from "./components/Indicator";

export const Initial = observer(() => {
  useEffect(() => {
    (async () => {
      await fetch(new URL("./libs/png.wasm", import.meta.url));
      await fetch(new URL("./libs/gif.wasm", import.meta.url));
      await import("./libs/WorkerPreview?worker");
      await import("./libs/WorkerCompress?worker");
      const langs = Object.values(locales);
      const pages = Object.values(modules);
      for (let load of [...langs, ...pages]) {
        await load();
      }
      initHistoryLogic();
    })();
  }, []);

  return (
    <Flex align="center" justify="center" className="__initial">
      <Flex vertical align="center">
        <Indicator size="large" />
        <Typography.Text type="secondary">
          {gstate.locale?.initial}...
        </Typography.Text>
      </Flex>
    </Flex>
  );
});
