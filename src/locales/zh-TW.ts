// 台湾繁体

import { LocaleData } from "./type";
import zhTW from "antd/locale/zh_TW";

const localeData: LocaleData = {
  antLocale: zhTW,
  logo: "圖小小",
  readFileTip: "讀取中",
  bundleTip: "打包中",
  uploadCard: {
    title: "拖曳或點選上傳",
    subTitle: ["支援", "格式"],
  },
  listAction: {
    batchAppend: "大量新增",
    clear: "清空清單",
    downloadAll: "下載全部",
    downloadOne: "下載圖片",
    removeOne: "移除圖片",
    reCompress: "重新壓縮",
  },
  columnTitle: {
    status: "狀態",
    name: "檔案名稱",
    preview: "預覽",
    size: "大小",
    dimension: "尺寸",
    decrease: "壓縮率",
    action: "操作",
    newSize: "新大小",
    newDimension: "新尺寸",
  },
  optionPannel: {
    changeDimension: "調整壓縮後的圖片尺寸",
    title: "壓縮選項",
    unChanged: "無縮放",
    toWidth: "適應寬度",
    toHeight: "適應高度",
    widthPlaceholder: "設定壓縮後圖片寬度",
    heightPlaceholder: "設定壓縮後圖片高度",
    qualityTitle: "設定壓縮質量(0-1)：數值越大，產生的圖片越大",
    resetBtn: "重置",
    confirmBtn: "確定",
    engineUpng: "普通壓縮引擎",
    engineLibPng: "進階壓縮引擎（更高壓縮品質，支援抖色）",
    colorsDesc: "設定輸出圖片顏色數（2-256）：顏色越多，輸出圖片越大",
    pngDithering: "設定抖色係數（0-1）：係數越大，圖片越清晰，但雜訊越多",
    gifDither: "開啟抖色：圖片更清晰，雜訊更多，輸出圖片更大",
  },
  error404: {
    backHome: "返回首頁",
    description: "抱歉，你造訪的頁面不存在~",
  },
  progress: {
    before: "壓縮前",
    after: "壓縮後",
    rate: "壓縮率",
  },
};

export default localeData;
