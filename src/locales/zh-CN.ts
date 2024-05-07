import { LocaleData } from "./type";
import zhCN from "antd/locale/zh_CN";

const localeData: LocaleData = {
  antLocale: zhCN,
  logo: "图小小",
  readFileTip: "读取中",
  bundleTip: '打包中',
  uploadCard: {
    title: "拖拽或点击上传",
    subTitle: ["支持", "格式"],
  },
  listAction: {
    batchAppend: "批量添加",
    clear: "清空列表",
    downloadAll: "下载全部",
    downloadOne: "下载图片",
    removeOne: "移除图片",
    reCompress: "重新压缩",
  },
  columnTitle: {
    status: "状态",
    name: "文件名",
    preview: "预览",
    size: "大小",
    dimension: "尺寸",
    decrease: "压缩率",
    action: "操作",
    newSize: "新大小",
    newDimension: "新尺寸",
  },
  optionPannel: {
    changeDimension: '调整压缩后的图片尺寸',
    title: "压缩选项",
    unChanged: "无缩放",
    toWidth: "适应宽度",
    toHeight: "适应高度",
    widthPlaceholder: "设置压缩后图片宽度",
    heightPlaceholder: "设置压缩后图片高度",
    resetBtn: "重置",
    confirmBtn: "确定",
    qualityTitle: "设置压缩质量(0-1)：数值越大，生成的图片越大",
    engineUpng: '普通压缩引擎',
    engineLibPng: '高级压缩引擎（更高输出品质，支持抖色）',
    colorsDesc: '设置输出图片颜色数（2-256）：颜色越多，输出图片越大',
    pngDithering: '设置抖色系数（0-1）：系数越大，图片越清晰，但噪点越多',
    gifDither: '开启抖色：图片更清晰，噪点更多，输出图片更大'
  },
  error404: {
    backHome: "返回首页",
    description: "抱歉，你访问的页面不存在~",
  },
  progress: {
    before: "压缩前",
    after: "压缩后",
    rate: "压缩率",
  },
};

export default localeData;
