import { cpSync, mkdirSync, rmSync } from "node:fs";

const codecs = [
  {
    name: "imagequant",
    assets: ["wasm/imagequant/imagequant.js", "wasm/imagequant/imagequant.wasm"],
  },
  {
    name: "oxipng",
    assets: [
      "wasm/oxipng/squoosh_oxipng.js",
      "wasm/oxipng/squoosh_oxipng_bg.wasm",
    ],
  },
  {
    name: "avif",
    assets: [
      "wasm/avif-enc/avif_enc.js",
      "wasm/avif-enc/avif_enc.wasm",
    ],
  },
  {
    name: "mozjpeg",
    assets: [
      "wasm/mozjpeg-enc/mozjpeg_enc.js",
      "wasm/mozjpeg-enc/mozjpeg_enc.wasm",
    ],
  },
];

for (const codec of codecs) {
  const source = `node_modules/@squoosh-kit/${codec.name}/dist`;
  const target = `public/codecs/${codec.name}`;
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  cpSync(`${source}/index.browser.mjs`, `${target}/index.browser.mjs`);
  for (const asset of codec.assets) {
    mkdirSync(`${target}/${asset.substring(0, asset.lastIndexOf("/"))}`, {
      recursive: true,
    });
    cpSync(`${source}/${asset}`, `${target}/${asset}`);
  }
}

const gifTarget = "public/codecs/gif";
rmSync(gifTarget, { recursive: true, force: true });
mkdirSync(gifTarget, { recursive: true });
cpSync("src/engines/GifWasmModule.js", `${gifTarget}/index.browser.mjs`);