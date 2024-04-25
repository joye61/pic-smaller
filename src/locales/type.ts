import { Locale } from "antd/es/locale";

export interface LocaleData {
  antLocale: Locale;
  logo: string;
  uploadCard: {
    title: string;
    subTitle: [string, string];
  };
  listAction: {
    batchAppend: string;
    clear: string;
    setting: string;
    downloadAll: string;
  };
  columnTitle: {
    status: string;
    name: string;
    preview: string;
    size: string;
    dimension: string;
    decrease: string;
    action: string;
  };
}
