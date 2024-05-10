import { LocaleData } from "./type";
import enUS from "antd/locale/en_US";

const localeData: LocaleData = {
  antLocale: enUS,
  logo: "Pic Smaller",
  readFileTip: "Loading",
  bundleTip: "Packing",
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
    resize: "Resize image",
    title: "Compression options",
    unChanged: "No Zoom",
    toWidth: "Fit Width",
    toHeight: "Fit Height",
    widthPlaceholder: "Enter the compressed image width",
    heightPlaceholder: "Enter the compressed image height",
    resetBtn: "Reset options",
    confirmBtn: "Apply options",
    qualityTitle: "Set output image quality (0-1)",
    colorsDesc: "Set the number of output colors (2-256)",
    pngDithering: "Set dithering coefficient (0-1)",
    gifDithering: "Turn on dithering",
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
