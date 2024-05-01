// 台湾繁体

import { LocaleData } from "./type";
import zhTW from "antd/locale/zh_TW";

const localeData: LocaleData = {
  antLocale: zhTW,
  logo: "圖小小",
  readFileTip: "讀取中",
  bundleTip: '打包中',
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
    title: "壓縮選項",
    unChanged: "無縮放",
    toWidth: "適應寬度",
    toHeight: "適應高度",
    widthPlaceholder: "設定壓縮後圖片寬度",
    heightPlaceholder: "設定壓縮後圖片高度",
    qualityTitle: "設定壓縮質量(0-100)：數值越大，產生的圖片越大",
    resetBtn: "重置",
    confirmBtn: "確定",
    enableHighPng: "啟用PNG型別高品質壓縮",
    highPngDither: "設定抖色係數(0-100)：數值越大，雜訊越多，但影像越平滑",
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
