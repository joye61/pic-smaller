import { MessageData, createHandler } from "./handler";

globalThis.addEventListener(
  "message",
  async (event: MessageEvent<MessageData>) => {
    const handler = await createHandler(event.data);
    if (handler) {
      const output = await handler.preview();
      globalThis.postMessage(output);
    }
  }
);
