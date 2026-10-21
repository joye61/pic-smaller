# LunePic

[简体中文](#简体中文) · [English](#english)

## 简体中文

LunePic 是一个免费、开源的浏览器端批量图片工作台。图片通过 Web Worker、WebAssembly、Canvas 和浏览器编解码器在用户设备上处理，不会上传到应用服务器。

正式站点：[https://img.arcanelune.top](https://img.arcanelune.top)

### 功能

- 批量压缩 JPEG、PNG、WebP、GIF、SVG 和 AVIF。
- 在本地解码 HEIC/HEIF，并导出为 JPEG、PNG、WebP 或 AVIF。
- 格式转换、缩放、裁剪与编码质量控制。
- 支持文件、文件夹、拖放和剪贴板粘贴。
- 压缩前后对比，单张下载或 ZIP 批量下载。
- 日间与夜间主题，简体中文和英文界面。

### 本地开发

要求 Node.js 22–24 和 npm 10+：

```bash
git clone https://github.com/ArcaneLune/pic-smaller.git
cd pic-smaller
npm ci
npm run dev
```

验证命令：

```bash
npm run lint
npm test
npm run build
```

生产镜像仅由 GitHub Actions 构建。版本标签触发部署，服务器不执行 Next.js 编译。完整流程见 [部署文档](./docs/DEPLOYMENT.md)。

## English

LunePic is a free, open-source batch image workspace that runs in the browser. Web Workers, WebAssembly, Canvas, and browser codecs process images on the user's device; files are never uploaded to the application server.

Production: [https://img.arcanelune.top](https://img.arcanelune.top)

### Features

- Batch compression for JPEG, PNG, WebP, GIF, SVG, and AVIF.
- Local HEIC/HEIF decoding with JPEG, PNG, WebP, or AVIF output.
- Format conversion, resizing, cropping, and encoder controls.
- File picker, folder picker, drag-and-drop, and clipboard input.
- Before/after comparison plus individual or ZIP downloads.
- Light and dark themes with Simplified Chinese and English interfaces.

### Development

Use Node.js 22–24 and npm 10 or newer:

```bash
git clone https://github.com/ArcaneLune/pic-smaller.git
cd pic-smaller
npm ci
npm run dev
```

Run `npm run lint`, `npm test`, and `npm run build` before opening a pull request. Production images are built by GitHub Actions and deployed only from SemVer tags; see [deployment documentation](./docs/DEPLOYMENT.md).

## License and attribution

LunePic is derived from [Pic Smaller](https://github.com/joye61/pic-smaller) and remains available under the [MIT License](./LICENSE). The original copyright and license notice are preserved.
