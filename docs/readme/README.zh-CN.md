# Pic Smaller (图小小)

[English](../../README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja-JP.md) · [한국어](README.ko-KR.md) · [Français](README.fr-FR.md) · [Español](README.es-ES.md) · [فارسی](README.fa-IR.md) · [Türkçe](README.tr-TR.md)

> [!IMPORTANT]
> ### Pic Smaller Desktop — 旗舰版
> **不妥协的原生性能，超越浏览器限制。**
>
> 使用旗舰版 Pic Smaller Desktop 升级您的工作流。这是一款专为追求卓越的专业人士打造的原生桌面应用——轻松驾驭超大文件与海量文件夹，支持 16+ 图片格式，并带来更卓越的处理性能。搭配全套 AI 工具：背景移除、水印移除与高保真图像放大，让体验更加完整。
>
> [![探索 Pic Smaller Desktop](https://img.shields.io/badge/Explore_Pic_Smaller_Desktop-00876c?style=for-the-badge)](https://desktop.picsmaller.com/)

Pic Smaller 是一款免费、开源的批量图片压缩工具，完全运行在浏览器中。图片通过
Web Workers、WebAssembly、Canvas 及浏览器编解码器在本地完成处理，文件绝不会
上传到任何应用服务器。

您可以使用托管版本 [picsmaller.com](https://picsmaller.com/) 或
[www.picsmaller.com](https://www.picsmaller.com/)。

## 功能特性

- 批量压缩 JPEG、PNG、WebP、GIF、SVG 和 AVIF 图片。
- 本地解码 HEIC 和 HEIF 输入，导出为 JPEG、PNG、WebP 或 AVIF。
- 格式转换、尺寸缩放、裁剪，以及针对各编码器的质量选项。
- 支持文件选择器、文件夹选择器、拖放和剪贴板粘贴等方式添加文件。
- 通过交互式分屏视图对比原图与压缩效果。
- 单独下载压缩结果，或打包为 ZIP 存档。
- 全程保护隐私：所有处理均留在您的设备上。

## 界面截图

![Pic Smaller 压缩工作区](../demo1.png)

核心工作区将批量输入、压缩结果、输出设置和下载操作整合在一个视图内。

## 开发

环境要求：

- Node.js 22 LTS 或更新版本
- npm 10 或更新版本

```bash
git clone https://github.com/joye61/pic-smaller.git
cd pic-smaller
npm ci
npm run dev
```

常用命令：

```bash
npm test            # 运行测试套件
npm run lint        # 运行 ESLint
npm run build       # 构建独立 Node.js 服务器
npm run build:pages # 导出 Cloudflare Pages 静态站点到 out/
```

## 部署

### Cloudflare Pages

公开站点使用 Cloudflare Pages 并集成 GitHub 仓库。
Cloudflare 根据以下设置自动构建和部署：

| 设置 | 值 |
| --- | --- |
| 生产分支 | `master` |
| 预览分支 | `develop` |
| 构建命令 | `npm run build:pages` |
| 输出目录 | `out` |
| Node.js 版本 | `22` |

推送到 `master` 即更新生产环境。推送到 `develop` 生成预览部署。
其他分支不会自动部署。

Pages 构建会移除 Next.js 生成的顶层 `404.html`，以便
Cloudflare Pages 应用其原生的单页应用回退机制。

### Docker

Docker 镜像是私有化或自托管部署的替代方案。它使用 Next.js 独立输出，
以非特权 `node` 用户运行，通过 `tini` 处理信号，并包含容器健康检查。

```bash
docker build --pull -t pic-smaller:latest .

docker run -d \
  --name pic-smaller \
  --restart unless-stopped \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  -p 127.0.0.1:3000:3000 \
  pic-smaller:latest
```

打开 `http://127.0.0.1:3000`。如需公网访问，请将容器放置在
TLS 终止反向代理（如 Caddy、nginx 或 Traefik）后方。
仅在有意直接暴露时移除 `127.0.0.1:` 绑定前缀。

### 密钥与配置

该 Web 应用不需要 API 密钥。切勿提交凭据、
Cloudflare 令牌、`.env` 文件、`.dev.vars`、私钥或本地 Wrangler 状态。
仓库忽略规则已排除这些文件。若未来功能需要密钥，请将其存储在部署平台的
密钥管理器中，并仅在 `.env.example` 文件中提供文档化的占位名称。

## 项目结构

- `src/app/`：Next.js 应用入口。
- `src/components/`：可复用的界面组件。
- `src/engines/`：浏览器编解码器、Worker、转换和压缩队列。
- `src/locales/`：多语言翻译。
- `src/views/`：应用视图。
- `public/`：构建时准备的浏览器编解码器和 WebAssembly 资源。
- `scripts/`：编解码器准备和部署构建辅助脚本。
- `tests/`：Node.js 测试套件。

## 参与贡献

1. 从 `develop` 分支创建新分支。
2. 运行 `npm test`、`npm run lint` 和相关生产构建。
3. 当行为或界面发生变化时，更新文档和截图。
4. 提交聚焦的 Pull Request，附上清晰的描述和验证说明。

## 许可证

Pic Smaller 基于 [MIT 许可证](./LICENSE) 发布。

## 致谢

- [Squoosh Kit](https://github.com/bnowak008/squoosh-kit) 提供 AVIF、ImageQuant 和 OxiPNG 编解码器。
- [heic-to](https://github.com/hoppergee/heic-to) 提供浏览器端 HEIC 和 HEIF 解码。
- [SVGO](https://github.com/svg/svgo) 提供 SVG 优化。
- [gifsicle-wasm-browser](https://github.com/renzhezhilu/gifsicle-wasm-browser) 提供 GIF 压缩。
