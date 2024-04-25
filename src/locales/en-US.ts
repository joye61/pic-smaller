import { LocaleData } from "./type";
import enUS from "antd/locale/en_US";

const localeData: LocaleData = {
  antLocale: enUS,
  logo: "PicSmaller",
  uploadCard: {
    title: "Drag and drop files or click to upload",
    subTitle: ["Support", "format"],
  },
  listAction: {
    batchAppend: 'Batch Append',
    clear: 'Clear the list',
    setting: 'Compression options',
    downloadAll: 'Download all'
  },
  columnTitle: {
    status: 'Status',
    name: 'Name',
    preview: 'Preview',
    size: 'Size',
    dimension: 'Dimension',
    decrease: 'Decrease',
    action: 'Action'
  }
};

export default localeData;
