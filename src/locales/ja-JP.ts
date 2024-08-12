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
    title:
      "ここでファイルを選択し、ファイルとフォルダーのドラッグをサポートします",
    subTitle: "オープンソースのバッチ画像圧縮ツール、%s 形式をサポート",
  },
  listAction: {
    batchAppend: "バッチ追加",
    addFolder: "フォルダーを追加",
    clear: "リストをクリア",
    downloadAll: "すべて保存",
    downloadOne: "画像を保存",
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
    failTip:
      "小さくすることができません。パラメータを調整して再試行してください。",
    help: "Pic Smaller はバッチ画像圧縮アプリケーションです。オプションの変更はすべての画像に適用されます。",
    resizeLable: "画像のサイズを変更する",
    jpegLable: "JPEG/WEBPパラメータ",
    pngLable: "PNG パラメータ",
    gifLable: "GIF パラメータ",
    avifLable: "AVIF パラメータ",
    resizePlaceholder: "調整モードの選択",
    fitWidth: "幅と高さを自動的に調整します",
    fitHeight: "高さと幅を自動的に調整します",
    setShort: "短辺と長辺を自動的に調整します",
    setLong: "長辺と短辺を自動的に調整します",
    setCropRatio: "クロップモード、クロップ率の設定",
    setCropSize: "切り抜きモード、切り抜きサイズを設定",
    cwRatioPlaceholder: "幅の比率を設定",
    chRatioPlaceholder: "高さの比率を設定",
    cwSizePlaceholder: "切り抜き幅を設定",
    chSizePlaceholder: "トリミングの高さを設定",
    widthPlaceholder: "出力画像の幅を設定します",
    heightPlaceholder: "出力画像の高さを設定します",
    shortPlaceholder: "出力画像の短辺の長さを設定する",
    longPlaceholder: "出力画像の長辺の長さを設定する",
    resetBtn: "オプションをリセット",
    confirmBtn: "オプションを適用",
    qualityTitle: "出力画質を設定します(0-1)",
    colorsDesc: "出力色の数を設定します (2-256)",
    pngDithering: "ディザリング係数を設定します (0-1)",
    gifDithering: "ディザリングをオンにする",
    avifQuality: "出力画質を設定します (1-100)",
    avifSpeed: "圧縮速度を設定します (1-10)",
    outputFormat: "出力形式を設定する",
    outputFormatPlaceholder: "出力画像フォーマットの選択",
    transparentFillDesc: "透明な塗りつぶしの色を選択します",
    cropCompareWarning: "クロップ モードは比較プレビューをサポートしていません",
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
