import { Queue } from "./Queue";
import { MessageData, OutputMessageData, createHandler } from "./handler";
import { avifCheck } from "./support";

(async () => {
  // Ensure avif check in worker
  await avifCheck();
  const queue = new Queue(3);

  globalThis.addEventListener(
    "message",
    async (event: MessageEvent<MessageData>) => {
      queue.push(async () => {
        const handler = await createHandler(event.data);
        if (handler) {
          const output = await handler.preview();
          const result: OutputMessageData = {
            key: handler.info.key,
            width: handler.info.width,
            height: handler.info.height,
            preview: output,
          };
          globalThis.postMessage(result);
        }
      });
    },
  );
})();
