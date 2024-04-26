import { LocaleData } from "./type";
import enUS from "antd/locale/en_US";

const localeData: LocaleData = {
  antLocale: enUS,
  logo: "Pic Smaller",
  uploadCard: {
    title: "Drag and drop files or click to upload",
    subTitle: ["Support", "format"],
  },
  listAction: {
    batchAppend: 'Batch Append',
    clear: 'Clear the list',
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
  },
  optionPannel: {
    title: "Compression options",
    unChanged: "No Zoom",
    toWidth: "Fit Width",
    toHeight: "Fit Height",
    widthPlaceholder: "Enter the compressed image width",
    heightPlaceholder: "Enter the compressed image height",
    qualityTitle: "Set the compression quality, the larger the value, the larger size the generated image",
    resetBtn: "Reset",
    confirmBtn: "Confirm"
  },
  error404: {
    backHome: 'Back to home',
    description: 'Sorry, the page you visited does not exist~'
  }
};

export default localeData;
