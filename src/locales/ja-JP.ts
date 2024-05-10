// 日语

import { LocaleData } from "./type";
import jaJP from "antd/locale/ja_JP";

const localeData: LocaleData = {
  antLocale: jaJP,
  logo: "Pic Smaller",
  readFileTip: "読み込み中",
  bundleTip: "パッキング",
  uploadCard: {
    title: "ここでローカル画像ファイルを選択またはドラッグします",
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
    resize: "画像のサイズを変更する",
    title: "圧縮オプション",
    unChanged: "スケーリングなし",
    toWidth: "幅に合わせる",
    toHeight: "高さに適応する",
    widthPlaceholder: "圧縮された画像の幅を設定します",
    heightPlaceholder: "圧縮画像の高さを設定します",
    resetBtn: "オプションをリセット",
    confirmBtn: "オプションを適用",
    qualityTitle: "出力画質を設定します(0-1)",
    colorsDesc: "出力色の数を設定します (2-256)",
    pngDithering: "ディザリング係数を設定します (0-1)",
    gifDithering: "ディザリングをオンにする",
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
