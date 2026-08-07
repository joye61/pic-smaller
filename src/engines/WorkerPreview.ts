import { Queue } from "./Queue";
import { createFailureOutput, MessageData, convert } from "./handler";

/**
 * Compute a safe worker concurrency based on the host CPU count.
 * We cap at 3 to bound WebAssembly memory usage; on single-core
 * machines we fall back to 1.
 */
(async () => {
  const queue = new Queue(1);

  globalThis.addEventListener(
    "message",
    async (event: MessageEvent<MessageData>) => {
      queue.push(async () => {
        try {
          const output = await convert(event.data, "preview");
          if (output) {
            globalThis.postMessage(output);
          }
        } catch (error) {
          globalThis.postMessage(createFailureOutput(event.data, "preview", error));
        }
      });
    },
  );
})();