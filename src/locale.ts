import getUserLocale from "get-user-locale";
import { LocaleData } from "./locales/type";
import { gstate } from "./global";

export async function initLocaleSetting() {
  const locale = getUserLocale();

  let localeData: LocaleData;
  if (/^zh[\_\-]?(CN|Hans|Hant)?$/i.test(locale)) {
    localeData = (await import("./locales/zh-CN")).default;
  } else {
    localeData = (await import("./locales/en-US")).default;
  }

  gstate.locale = localeData;
}
