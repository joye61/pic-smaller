import { LocaleData } from "./type";
import enUS from "antd/locale/en_US";

const localeData: LocaleData = {
  antLocale: enUS,
  logo: "Pic Smaller",
  readFileTip: "Loading",
  bundleTip: 'Packing',
  uploadCard: {
    title: "Drag and drop files or click to upload",
    subTitle: ["Support", "format"],
  },
  listAction: {
    batchAppend: "Batch append",
    clear: "Clear all",
    downloadAll: "Download all",
    downloadOne: "Download image",
    removeOne: "Remove image",
    reCompress: "Recompress",
  },
  columnTitle: {
    status: "Status",
    name: "Name",
    preview: "Preview",
    size: "Size",
    dimension: "Dimension",
    decrease: "Decrease",
    action: "Action",
    newSize: "New size",
    newDimension: "New Dimension",
  },
  optionPannel: {
    title: "Compression options",
    unChanged: "No Zoom",
    toWidth: "Fit Width",
    toHeight: "Fit Height",
    widthPlaceholder: "Enter the compressed image width",
    heightPlaceholder: "Enter the compressed image height",
    qualityTitle:
      "Set compression quality (0-100): the larger the value, the larger size the generated image",
    resetBtn: "Reset",
    confirmBtn: "Confirm",
    enableHighPng: "Enable high-quality compression of PNG type",
    highPngDither:
      "Set dithering factor (0-100):  the larger the value, the more noise and the smoother the image",
  },
  error404: {
    backHome: "Back to home",
    description: "Sorry, the page you visited does not exist~",
  },
  progress: {
    before: "Before compression",
    after: "After compression",
    rate: "Decrease ratio",
  },
};

export default localeData;
