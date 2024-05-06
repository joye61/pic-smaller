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
    changeDimension: "Adjust compressed image size",
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
    engineUpng: "Normal compression engine",
    engineLibPng:
      "Advanced compression engine (higher compression quality, support for color dithering)",
    colorsDesc:
      "Set the number of colors for the output image (2-256): the more colors, the larger size the output image",
    pngDithering:
      "Set the dithering coefficient (0-1): the larger the coefficient, the clearer the picture, but the more noise there is",
    gifDither:
      "Turn on dithering: the image is clearer, the noise is more, and the output image size is larger",
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
