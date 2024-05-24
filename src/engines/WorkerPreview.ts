import { Queue } from "./Queue";
import { MessageData, convert } from "./handler";
import { avifCheck } from "./support";

(async () => {
  // Ensure avif check in worker
  await avifCheck();
  const queue = new Queue(3);

  globalThis.addEventListener(
    "message",
    async (event: MessageEvent<MessageData>) => {
      queue.push(async () => {
        const output = await convert(event.data, "preview");
        if (output) {
          globalThis.postMessage(output);
        }
      });
    },
  );
})();
