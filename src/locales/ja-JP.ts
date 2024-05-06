// 日语

import { LocaleData } from "./type";
import jaJP from "antd/locale/ja_JP";

const localeData: LocaleData = {
  antLocale: jaJP,
  logo: "Pic Smaller",
  readFileTip: "読み込み中",
  bundleTip: "パッキング",
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
    changeDimension: "圧縮された画像サイズを調整する",
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
    engineUpng: "通常の圧縮エンジン",
    engineLibPng:
      "高度な圧縮エンジン (より高い圧縮品質、カラー ディザリングのサポート)",
    colorsDesc:
      "出力画像の色数を設定します (2-256): 色が多いほど、出力画像は大きくなります",
    pngDithering:
      "ディザリング係数を設定します (0-1): 係数が大きいほど、画像は鮮明になりますが、ノイズが多くなります",
    gifDither:
      "ディザリングをオンにすると、画像がより鮮明になり、ノイズが多くなり、出力画像が大きくなります",
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
