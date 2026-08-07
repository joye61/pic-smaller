import { MAX_CONCURRENCY } from "./ImageBase";
import { Queue } from "./Queue";
import { createFailureOutput, MessageData, convert } from "./handler";

/**
 * Compute a safe worker concurrency based on the host CPU count.
 * We cap at 3 to bound WebAssembly memory usage; on single-core
 * machines we fall back to 1.
 */
function getConcurrency(): number {
  const cores = globalThis.navigator?.hardwareConcurrency ?? 4;
  return Math.min(MAX_CONCURRENCY, Math.max(1, cores - 1));
}

(async () => {
  const queue = new Queue(getConcurrency());

  globalThis.addEventListener(
    "message",
    async (event: MessageEvent<MessageData>) => {
      queue.push(async () => {
        try {
          const output = await convert(event.data, "compress");
          if (output) {
            globalThis.postMessage(output);
          }
        } catch (error) {
          globalThis.postMessage(createFailureOutput(event.data, "compress", error));
        }
      });
    },
  );
})();