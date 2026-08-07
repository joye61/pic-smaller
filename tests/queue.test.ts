import assert from "node:assert/strict";
import test from "node:test";
import { Queue } from "@/engines/Queue";

test("Queue continues after a rejected task", async () => {
  const queue = new Queue(1);
  const order: Array<string> = [];

  queue.push(async () => {
    order.push("first");
    throw new Error("boom");
  });
  queue.push(async () => {
    order.push("second");
  });

  // Wait for the queue to drain.
  await waitFor(() => order.includes("second"));
  assert.deepEqual(order, ["first", "second"]);
  assert.equal(queue.running, 0);
});

test("Queue drains all tasks even when one rejects mid-batch", async () => {
  const queue = new Queue(2);
  const order: Array<string> = [];

  queue.push(async () => {
    order.push("a");
    throw new Error("a fail");
  });
  queue.push(async () => {
    order.push("b");
  });
  queue.push(async () => {
    order.push("c");
  });

  await waitFor(() => order.includes("c"));
  assert.deepEqual(order.sort(), ["a", "b", "c"]);
  assert.equal(queue.running, 0);
});

function waitFor(predicate: () => boolean, timeoutMs = 2000) {
  return new Promise<void>((resolve, reject) => {
    const started = Date.now();
    const timer = setInterval(() => {
      if (predicate()) {
        clearInterval(timer);
        resolve();
      } else if (Date.now() - started > timeoutMs) {
        clearInterval(timer);
        reject(new Error("Timed out waiting for queue to drain"));
      }
    }, 10);
  });
}
