// 台湾繁体

import { LocaleData } from '@/type';
import zhTW from "antd/locale/zh_TW";

const localeData: LocaleData = {
  antLocale: zhTW,
  logo: "圖小小",
  initial: "初始化中",
  previewHelp: '拖曳分割線對比壓縮效果：左邊是原始圖，右邊是壓縮圖',
  uploadCard: {
    title: "選取或拖曳本地圖片檔案到這裡",
    subTitle: ["支援", "格式"],
  },
  listAction: {
    batchAppend: "大量新增",
    addFolder: '新增資料夾',
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
    resize: "調整圖片尺寸",
    unChanged: "無縮放",
    toWidth: "適應寬度",
    toHeight: "適應高度",
    widthPlaceholder: "設定壓縮後圖片寬度",
    heightPlaceholder: "設定壓縮後圖片高度",
    resetBtn: "重置選項",
    confirmBtn: "應用選項",
    qualityTitle: "設定輸出圖片品質（0-1）",
    colorsDesc: "設定輸出顏色數量（2-256）",
    pngDithering: "設定抖色係數（0-1）",
    gifDithering: "開啟抖色",
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
