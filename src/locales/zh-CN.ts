import { LocaleData } from '@/type';
import zhCN from "antd/locale/zh_CN";

const localeData: LocaleData = {
  antLocale: zhCN,
  logo: "图小小",
  initial: "初始化中",
  previewHelp: '拖动分割线对比压缩效果：左边是原始图，右边是压缩图',
  uploadCard: {
    title: "选取或者拖拽本地图片文件到这里",
    subTitle: ["支持", "格式"],
  },
  listAction: {
    batchAppend: "批量添加",
    addFolder: "添加文件夹",
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
    resize: "调整图片尺寸",
    unChanged: "无缩放",
    toWidth: "适应宽度",
    toHeight: "适应高度",
    widthPlaceholder: "设置压缩后图片宽度",
    heightPlaceholder: "设置压缩后图片高度",
    resetBtn: "重置选项",
    confirmBtn: "应用选项",
    qualityTitle: "设置输出图片质量（0-1）",
    colorsDesc: "设置输出颜色数量（2-256）",
    pngDithering: "设置抖色系数（0-1）",
    gifDithering: "开启抖色",
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
