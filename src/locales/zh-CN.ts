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
    setting: "压缩选项",
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
};

export default localeData;
