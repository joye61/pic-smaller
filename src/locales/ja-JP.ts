// 日语

import { LocaleData } from "@/type";
import jaJP from "antd/locale/ja_JP";

const localeData: LocaleData = {
  antLocale: jaJP,
  logo: "Pic Smaller",
  initial: "初期化中",
  previewHelp:
    "分割線をドラッグして圧縮効果を比較します。左が元の画像、右が圧縮された画像です",
  uploadCard: {
    title: "ここでファイルを選択し、ファイルとフォルダーのドラッグをサポートします",
    subTitle: "Pic Smaller は完全にオープンソースで、%s 形式をサポートする無料のバッチ画像圧縮ツールです。",
  },
  listAction: {
    batchAppend: "バッチ追加",
    addFolder: "フォルダーを追加",
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
    resizeLable: "画像のサイズを変更する",
    formatLable: "出力形式を設定",
    jpegLable: "JPEG/WEBPパラメータ",
    pngLable: "PNG パラメータ",
    gifLable: "GIF パラメータ",
    unChanged: "スケーリングなし",
    toWidth: "幅に合わせる",
    toHeight: "高さに適応する",
    widthPlaceholder: "出力画像の幅を設定します",
    heightPlaceholder: "出力画像の高さを設定します",
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
