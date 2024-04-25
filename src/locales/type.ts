import { Locale } from "antd/es/locale";

export interface LocaleData {
  antLocale: Locale;
  logo: string;
  uploadCard: {
    title: string;
    subTitle: [string, string];
  };
}
