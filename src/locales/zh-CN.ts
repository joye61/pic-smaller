import { LocaleData } from "./type";
import zhCN from "antd/locale/zh_CN";

const localeData: LocaleData = {
  antLocale: zhCN,
  logo: "图小小",
  uploadCard: {
    title: "拖拽或点击上传",
    subTitle: ["支持", "格式"],
  },
  listAction: {
    batchAppend: "批量添加",
    clear: "清空列表",
    downloadAll: "下载全部",
  },
  columnTitle: {
    status: "状态",
    name: "文件名",
    preview: "预览",
    size: "大小",
    dimension: "尺寸",
    decrease: "压缩率",
    action: "操作",
  },
  optionPannel: {
    title: "压缩选项",
    unChanged: "无缩放",
    toWidth: "适应宽度",
    toHeight: "适应高度",
    widthPlaceholder: "设置压缩后图片宽度",
    heightPlaceholder: "设置压缩后图片高度",
    qualityTitle: "设置压缩质量（数值越大，生成的图片越大）",
    resetBtn: "重置",
    confirmBtn: "确定"
  },
  error404: {
    backHome: '返回首页',
    description: '抱歉，你访问的页面不存在~'
  }
};

export default localeData;
