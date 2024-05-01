// 日语

import { LocaleData } from "./type";
import jaJP from "antd/locale/ja_JP";

const localeData: LocaleData = {
  antLocale: jaJP,
  logo: "Pic Smaller",
  readFileTip: "読み込み中",
  bundleTip: 'パッキング',
  uploadCard: {
    title: "ドラッグまたはクリックしてアップロードします",
    subTitle: ["サポート", "フォーマット"],
  },
  listAction: {
    batchAppend: "バッチ追加",
    clear: "リストをクリア",
    downloadAll: "すべてダウンロード",
    downloadOne: "画像をダウンロード",
    removeOne: "画像を削除",
    reCompress: "再圧縮",
  },
  columnTitle: {
    status: "ステータス",
    name: "ファイル名",
    preview: "プレビュー",
    size: "サイズ",
    dimension: "サイズ",
    decrease: "圧縮率",
    action: "アクション",
    newSize: "新しいサイズ",
    newDimension: "新しいディメンション",
  },
  optionPannel: {
    title: "圧縮オプション",
    unChanged: "スケーリングなし",
    toWidth: "幅に合わせる",
    toHeight: "高さに適応する",
    widthPlaceholder: "圧縮された画像の幅を設定します",
    heightPlaceholder: "圧縮画像の高さを設定します",
    qualityTitle:
      "圧縮品質を設定します(0-100): 値が大きいほど、生成される画像も大きくなります",
    resetBtn: "リセット",
    confirmBtn: "もちろん",
    enableHighPng: "PNG タイプの高品質圧縮を有効にする",
    highPngDither:
      "ディザ係数を設定します(0-100): 値が大きいほどノイズが多くなりますが、画像は滑らかになります。",
  },
  error404: {
    backHome: "ホームページに戻る",
    description: "申し訳ありませんが、アクセスしたページは存在しません~",
  },
  progress: {
    before: "圧縮前",
    after: "圧縮後",
    rate: "圧縮率",
  },
};

export default localeData;
