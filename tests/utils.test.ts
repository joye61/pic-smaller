import { expect, test } from "vitest";
import { getUniqNameOnNames, normalize } from "@/functions";

test("Path normalize check", () => {
  expect(normalize("")).toBe("");
  expect(normalize("/a/b")).toBe("a/b");
  expect(normalize("/sub/a/b", "/sub")).toBe("a/b");
  expect(normalize("/a/b", "/sub")).toBe("error404");
});

test("Rename check", () => {
  const names = new Set<string>(["a.jpg", "b.png"]);
  expect(getUniqNameOnNames(names, "a.jpg")).toBe("a(1).jpg");
  names.add("a(1).jpg");
  expect(getUniqNameOnNames(names, "a.jpg")).toBe("a(1)(1).jpg");
});
