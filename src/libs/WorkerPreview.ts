import { MessageData, OutputMessageData, createHandler } from "./handler";

globalThis.addEventListener(
  "message",
  async (event: MessageEvent<MessageData>) => {
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
  }
);
