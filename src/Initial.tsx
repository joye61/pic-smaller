import { observer } from 'mobx-react-lite';
import { Flex, Typography } from 'antd';
import { useEffect } from 'react';
import { locales, modules } from './modules';
import { initHistoryLogic } from './history';
import { gstate } from './global';
import { Indicator } from './components/Indicator';
import { isAvifSupport } from './engines/support';
import { Mimes } from './mimes';

export const Initial = observer(() => {
  useEffect(() => {
    (async () => {
      await import('jszip');
      await fetch(new URL('./engines/png.wasm', import.meta.url));
      await fetch(new URL('./engines/gif.wasm', import.meta.url));
      await fetch(new URL('./engines/avif.wasm', import.meta.url));
      await import('./engines/WorkerPreview?worker');
      await import('./engines/WorkerCompress?worker');
      const langs = Object.values(locales);
      const pages = Object.values(modules);
      for (let load of [...langs, ...pages]) {
        await load();
      }
      if (await isAvifSupport()) {
        Mimes.avif = 'image/avif';
      }
      initHistoryLogic();
    })();
  }, []);

  return (
    <Flex align="center" justify="center" className="__initial">
      <Flex vertical align="center">
        <Indicator size="large" />
        <Typography.Text type="secondary">
          {gstate.locale?.initial}
        </Typography.Text>
      </Flex>
    </Flex>
  );
});
