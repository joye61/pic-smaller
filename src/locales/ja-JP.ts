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
    fitWidth: "幅を設定し、高さは自動的に拡大縮小します",
    fitHeight: "高さを設定すると、幅は自動的に拡大縮小されます",
    widthPlaceholder: "出力画像の幅を設定します",
    heightPlaceholder: "出力画像の高さを設定します",
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
