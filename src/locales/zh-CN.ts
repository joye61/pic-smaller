import { LocaleData } from "@/type";
import zhCN from "antd/locale/zh_CN";

const localeData: LocaleData = {
  antLocale: zhCN,
  logo: "图小小",
  initial: "初始化中",
  previewHelp: "拖动分割线对比压缩效果：左边是原始图，右边是压缩图",
  uploadCard: {
    title: "选取文件到这里，支持拖拽文件和文件夹",
    subTitle: "开源的批量图片压缩工具，支持 %s 格式",
  },
  listAction: {
    batchAppend: "批量添加",
    addFolder: "添加文件夹",
    clear: "清空列表",
    downloadAll: "保存全部",
    downloadOne: "保存图片",
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
    failTip: "无法更小，请调整参数后重试",
    help: "图小小是一款批量图片压缩应用程序，对选项的修改将应用到所有图片上",
    resizeLable: "调整图片尺寸",
    jpegLable: "JPEG/WEBP参数",
    pngLable: "PNG参数",
    gifLable: "GIF参数",
    avifLable: "AVIF参数",
    resizePlaceholder: "选择调整模式",
    fitWidth: "设置宽度，高度自动缩放",
    fitHeight: "设置高度，宽度自动缩放",
    widthPlaceholder: "设置输出图片宽度",
    heightPlaceholder: "设置输出图片高度",
    resetBtn: "重置选项",
    confirmBtn: "应用选项",
    qualityTitle: "设置输出图片质量（0-1）",
    colorsDesc: "设置输出颜色数量（2-256）",
    pngDithering: "设置抖色系数（0-1）",
    gifDithering: "开启抖色",
    avifQuality: "设置输出图片质量（1-100）",
    avifSpeed: "设置压缩速度（1-10）",
    outputFormat: "设置输出格式",
    outputFormatPlaceholder: "选择输出图片格式",
    transparentFillDesc: "选择透明填充色",
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
