# Pic Smaller (図小小)

[English](../../README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja-JP.md) · [한국어](README.ko-KR.md) · [Français](README.fr-FR.md) · [Español](README.es-ES.md) · [فارسی](README.fa-IR.md) · [Türkçe](README.tr-TR.md)

> [!IMPORTANT]
> ### Pic Smaller Desktop — フラッグシップエディション
> **妥協なきネイティブパワー、ブラウザの限界を超えて。**
>
> フラッグシップの Pic Smaller Desktop でワークフローを次の次元へ。一切の妥協を許さないプロフェッショナルのために構築された専用ネイティブアプリケーション——巨大なファイルやフォルダライブラリ全体を軽々と処理し、16 以上の画像フォーマットをサポート、卓越した処理性能を発揮します。背景除去、透かし除去、高精細アップスケーリングといった高度な AI ツール群で、体験を完成させてください。
>
> [![Pic Smaller Desktop を探す](https://img.shields.io/badge/Explore_Pic_Smaller_Desktop-00876c?style=for-the-badge)](https://desktop.picsmaller.com/)

Pic Smaller は完全にブラウザ上で動作するフリーでオープンソースのバッチ画像圧縮ツールです。
画像は Web Workers、WebAssembly、Canvas、そしてブラウザのコーデックを使って
ローカルで処理され、ファイルがアプリケーションサーバーにアップロードされることは決してありません。

ホスト版は [picsmaller.com](https://picsmaller.com/) または
[www.picsmaller.com](https://www.picsmaller.com/) でご利用いただけます。

## 機能

- JPEG、PNG、WebP、GIF、SVG、AVIF 画像のバッチ圧縮。
- HEIC および HEIF のローカルデコードと JPEG、PNG、WebP、AVIF へのエクスポート。
- フォーマット変換、リサイズ、クロップ、エンコーダー固有の品質オプション。
- ファイルピッカー、フォルダピッカー、ドラッグ＆ドロップ、クリップボード貼り付けでファイルを追加。
- インタラクティブな分割ビューで元画像と圧縮画像を比較。
- 個別ダウンロードまたはバッチ全体を ZIP アーカイブとして保存。
- プライバシーを守ります：すべての処理はユーザーのデバイス上で行われます。

## スクリーンショット

![Pic Smaller 圧縮ワークスペース](../demo1.png)

コアワークスペースにはバッチ入力、圧縮結果、出力設定、ダウンロード操作が
ひとつのビューに統合されています。

## 開発

要件:

- Node.js 22 LTS 以上
- npm 10 以上

```bash
git clone https://github.com/joye61/pic-smaller.git
cd pic-smaller
npm ci
npm run dev
```

便利なコマンド:

```bash
npm test            # テストスイートの実行
npm run lint        # ESLint の実行
npm run build       # スタンドアロン Node.js サーバーのビルド
npm run build:pages # Cloudflare Pages 静的サイトを out/ にエクスポート
```

## デプロイ

### Cloudflare Pages

公開サイトは GitHub リポジトリ統合で Cloudflare Pages を使用しています。
Cloudflare は以下の設定で自動的にビルドとデプロイを行います：

| 設定 | 値 |
| --- | --- |
| 本番ブランチ | `master` |
| プレビューブランチ | `develop` |
| ビルドコマンド | `npm run build:pages` |
| 出力ディレクトリ | `out` |
| Node.js バージョン | `22` |

`master` へのプッシュで本番環境が更新されます。`develop` へのプッシュで
プレビューデプロイが作成されます。他のブランチは自動デプロイされません。

Pages ビルドでは Next.js が生成するトップレベルの `404.html` を削除し、
Cloudflare Pages のネイティブな SPA フォールバックを適用できるようにします。

### Docker

Docker イメージはプライベートまたはセルフホスト展開の代替手段です。
Next.js スタンドアロン出力を使用し、非特権 `node` ユーザーとして実行、
`tini` でシグナルを処理し、コンテナヘルスチェックを含みます。

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

`http://127.0.0.1:3000` を開きます。公開アクセスには Caddy、nginx、
Traefik などの TLS 終端リバースプロキシの背後にコンテナを配置してください。
直接のネットワーク露出が意図的な場合のみ `127.0.0.1:` バインドプレフィックスを外してください。

### シークレットと設定

この Web アプリケーションは API キーを必要としません。
認証情報、Cloudflare トークン、`.env` ファイル、`.dev.vars`、秘密鍵、
ローカル Wrangler 状態をコミットしないでください。
リポジトリの無視ルールはこれらのファイルを除外します。
将来の機能でシークレットが必要な場合は、デプロイプラットフォームの
シークレットマネージャーに保存し、`.env.example` ファイルに
プレースホルダー名のみを記載してください。

## プロジェクト構造

- `src/app/`: Next.js アプリケーションエントリポイント。
- `src/components/`: 再利用可能なインターフェースコンポーネント。
- `src/engines/`: ブラウザコーデック、Worker、変換、圧縮キュー。
- `src/locales/`: 翻訳。
- `src/views/`: アプリケーションビュー。
- `public/`: ビルド時に準備されるブラウザコーデックと WebAssembly アセット。
- `scripts/`: コーデック準備とデプロイビルドヘルパー。
- `tests/`: Node.js テストスイート。

## コントリビューション

1. `develop` からブランチを作成してください。
2. `npm test`、`npm run lint`、関連する本番ビルドを実行してください。
3. 動作やインターフェースの変更時はドキュメントとスクリーンショットを更新してください。
4. 明確な説明と検証ノートを含む焦点を絞った Pull Request を提出してください。

## ライセンス

Pic Smaller は [MIT ライセンス](./LICENSE) の下で提供されています。

## 謝辞

- [Squoosh Kit](https://github.com/bnowak008/squoosh-kit) — AVIF、ImageQuant、OxiPNG コーデック。
- [heic-to](https://github.com/hoppergee/heic-to) — ブラウザ側の HEIC・HEIF デコード。
- [SVGO](https://github.com/svg/svgo) — SVG 最適化。
- [gifsicle-wasm-browser](https://github.com/renzhezhilu/gifsicle-wasm-browser) — GIF 圧縮。
