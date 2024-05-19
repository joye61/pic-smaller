import { Queue } from "./Queue";
import { MessageData, OutputMessageData, createHandler } from "./handler";

const queue = new Queue(3);

globalThis.addEventListener(
  "message",
  async (event: MessageEvent<MessageData>) => {
    queue.push(async () => {
      const handler = await createHandler(event.data);
      if (handler) {
        const output = await handler.compress();
        const result: OutputMessageData = {
          key: handler.info.key,
          width: handler.info.width,
          height: handler.info.height,
          compress: output,
        };
        globalThis.postMessage(result);
      }
    });
  }
);
