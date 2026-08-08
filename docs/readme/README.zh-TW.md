# Pic Smaller (圖小小)

[English](../../README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja-JP.md) · [한국어](README.ko-KR.md) · [Français](README.fr-FR.md) · [Español](README.es-ES.md) · [فارسی](README.fa-IR.md) · [Türkçe](README.tr-TR.md)

> [!IMPORTANT]
> ### Pic Smaller Desktop — 旗艦版
> **不妥協的原生效能，超越瀏覽器限制。**
>
> 使用旗艦版 Pic Smaller Desktop 升級您的工作流程。這是一款專為追求卓越的專業人士打造的原生桌面應用——輕鬆駕馭超大檔案與海量資料夾，支援 16+ 圖片格式，並帶來更卓越的處理效能。搭配全套 AI 工具：背景移除、浮水印移除與高保真圖像放大，讓體驗更加完整。
>
> [![探索 Pic Smaller Desktop](https://img.shields.io/badge/Explore_Pic_Smaller_Desktop-00876c?style=for-the-badge)](https://desktop.picsmaller.com/)

Pic Smaller 是一款免費、開源的批次圖片壓縮工具，完全在瀏覽器中執行。圖片透過
Web Workers、WebAssembly、Canvas 及瀏覽器編解碼器在本機完成處理，檔案絕不
上傳到任何應用伺服器。

您可以使用託管版本 [picsmaller.com](https://picsmaller.com/) 或
[www.picsmaller.com](https://www.picsmaller.com/)。

## 功能特性

- 批次壓縮 JPEG、PNG、WebP、GIF、SVG 和 AVIF 圖片。
- 本機解碼 HEIC 和 HEIF 輸入，匯出為 JPEG、PNG、WebP 或 AVIF。
- 格式轉換、尺寸縮放、裁剪，以及針對各編碼器的品質選項。
- 支援檔案選擇器、資料夾選擇器、拖放和剪貼簿貼上等方式新增檔案。
- 透過互動式分屏檢視對比原圖與壓縮效果。
- 單獨下載壓縮結果，或打包為 ZIP 存檔。
- 全程保護隱私：所有處理均留在您的裝置上。

## 介面截圖

![Pic Smaller 壓縮工作區](../demo1.png)

核心工作區將批次輸入、壓縮結果、輸出設定和下載操作整合在一個檢視內。

## 開發

環境要求：

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
npm test            # 執行測試套件
npm run lint        # 執行 ESLint
npm run build       # 構建獨立 Node.js 伺服器
npm run build:pages # 匯出 Cloudflare Pages 靜態站點到 out/
```

## 部署

### Cloudflare Pages

公開站點使用 Cloudflare Pages 並整合 GitHub 倉庫。
Cloudflare 根據以下設定自動構建和部署：

| 設定 | 值 |
| --- | --- |
| 生產分支 | `master` |
| 預覽分支 | `develop` |
| 構建命令 | `npm run build:pages` |
| 輸出目錄 | `out` |
| Node.js 版本 | `22` |

推送到 `master` 即更新生產環境。推送到 `develop` 生成預覽部署。
其他分支不會自動部署。

Pages 構建會移除 Next.js 生成的頂層 `404.html`，以便
Cloudflare Pages 應用其原生的單頁應用回退機制。

### Docker

Docker 映像是私有化或自託管部署的替代方案。它使用 Next.js 獨立輸出，
以非特權 `node` 使用者執行，透過 `tini` 處理訊號，並包含容器健康檢查。

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

開啟 `http://127.0.0.1:3000`。如需公網存取，請將容器放置在
TLS 終止反向代理（如 Caddy、nginx 或 Traefik）後方。
僅在有意直接暴露時移除 `127.0.0.1:` 繫結字首。

### 金鑰與配置

該 Web 應用不需要 API 金鑰。切勿提交憑據、
Cloudflare 令牌、`.env` 檔案、`.dev.vars`、私密金鑰或本機 Wrangler 狀態。
倉庫忽略規則已排除這些檔案。若未來功能需要金鑰，請將其儲存在部署平台的
金鑰管理器中，並僅在 `.env.example` 檔案中提供文檔化的佔位名稱。

## 專案結構

- `src/app/`：Next.js 應用入口。
- `src/components/`：可復用的介面元件。
- `src/engines/`：瀏覽器編解碼器、Worker、轉換和壓縮佇列。
- `src/locales/`：多語言翻譯。
- `src/views/`：應用檢視。
- `public/`：構建時準備的瀏覽器編解碼器和 WebAssembly 資源。
- `scripts/`：編解碼器準備和部署構建輔助指令碼。
- `tests/`：Node.js 測試套件。

## 參與貢獻

1. 從 `develop` 分支建立新分支。
2. 執行 `npm test`、`npm run lint` 和相關生產構建。
3. 當行為或介面發生變化時，更新文檔和截圖。
4. 提交聚焦的 Pull Request，附上清晰的描述和驗證說明。

## 授權條款

Pic Smaller 基於 [MIT 授權條款](./LICENSE) 發布。

## 致謝

- [Squoosh Kit](https://github.com/bnowak008/squoosh-kit) 提供 AVIF、ImageQuant 和 OxiPNG 編解碼器。
- [heic-to](https://github.com/hoppergee/heic-to) 提供瀏覽器端 HEIC 和 HEIF 解碼。
- [SVGO](https://github.com/svg/svgo) 提供 SVG 最佳化。
- [gifsicle-wasm-browser](https://github.com/renzhezhilu/gifsicle-wasm-browser) 提供 GIF 壓縮。
