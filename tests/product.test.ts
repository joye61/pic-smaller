import assert from "node:assert/strict";
import test from "node:test";
import { GET as getHealth } from "../src/app/api/health/route";
import {
  defaultLocale,
  isLegacyLocale,
  isSupportedLocale,
  siteUrl,
  supportedLocales,
} from "../src/locale-config";
import zhCN from "../src/locales/zh-CN";
import { createLocaleMetadata } from "../src/seo";
import {
  applyTheme,
  persistTheme,
  readTheme,
  themeStorageKey,
} from "../src/theme";
import {
  localeStorageKey,
  toolOptionsStorageKey,
} from "../src/storage";

test("LunePic exposes only the Chinese-first bilingual locale set", () => {
  assert.equal(defaultLocale, "zh-CN");
  assert.deepEqual(supportedLocales, ["zh-CN", "en-US"]);
  assert.equal(isSupportedLocale("zh-CN"), true);
  assert.equal(isSupportedLocale("ja-JP"), false);
  assert.equal(isLegacyLocale("ja-JP"), true);
});

test("locale metadata points to the LunePic production domain", () => {
  const metadata = createLocaleMetadata("zh-CN", zhCN);
  assert.equal(siteUrl, "https://img.arcanelune.top");
  assert.equal(metadata.openGraph?.siteName, "LunePic");
  assert.equal(metadata.alternates?.canonical, "/zh-CN");
  assert.equal(metadata.alternates?.languages?.["x-default"], "/zh-CN");
});

test("health endpoint returns a non-cacheable release identity", async () => {
  const response = getHealth();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = (await response.json()) as { status: string; version: string };
  assert.equal(body.status, "ok");
  assert.ok(body.version.length > 0);
});

test("theme defaults to light and persists an explicit dark selection", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
  const root: { dataset: DOMStringMap } = { dataset: {} };

  assert.equal(readTheme(storage), "light");
  persistTheme("dark", storage, root);
  assert.equal(values.get(themeStorageKey), "dark");
  assert.equal(root.dataset.theme, "dark");

  applyTheme("light", root);
  assert.equal(root.dataset.theme, "light");
});

test("browser preferences use LunePic-owned storage keys", () => {
  assert.equal(themeStorageKey, "lunepic-theme");
  assert.equal(localeStorageKey, "lunepic-locale");
  assert.equal(toolOptionsStorageKey, "lunepic-options");
});
