import { MessageData, OutputMessageData, createHandler } from "./handler";

globalThis.addEventListener(
  "message",
  async (event: MessageEvent<MessageData>) => {
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
  }
);
