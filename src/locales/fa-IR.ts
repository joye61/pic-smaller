import { LocaleData } from "@/type";
import faIR from "antd/locale/fa_IR";

const localeData: LocaleData = {
  antLocale: faIR,
  logo: "پیک کوچولو",
  initial: "در حال راه‌اندازی",
  previewHelp:
    "خط تقسیم را برای مقایسه اثر فشرده سازی بکشید: سمت چپ تصویر اصلی و سمت راست تصویر فشرده است",
  uploadCard: {
    title:
      "فایل‌ها را اینجا انتخاب کنید (پشتیبانی از روش کشیدن و انداختن فایل‌ها و پوشه‌ها)",
    subTitle: "ابزار فشرده‌سازی هوشمند دسته‌ای تصاویر، پشتیبانی از فرمت‌های %s",
  },
  listAction: {
    batchAppend: "افزودن دسته‌ای",
    addFolder: "افزودن پوشه",
    clear: "پاک کردن همه",
    downloadAll: "ذخیره همه",
    downloadOne: "بارگذاری تصویر",
    removeOne: "پاک کردن تصویر",
    reCompress: "فشرده‌سازی مجدد",
  },
  columnTitle: {
    status: "وضعیت",
    name: "نام",
    preview: "پیش‌نمایش",
    size: "اندازه",
    dimension: "ابعاد",
    decrease: "کاهش",
    action: "عملیات",
    newSize: "اندازه جدید",
    newDimension: "ابعاد جدید",
  },
  optionPannel: {
    failTip:
      "کوچکتر از این نمی‌شود! لطفا پارامترها را تغییر دهید و دوباره امتحان کنید",
    help: "پیک کوچولو یک برنامه فشرده‌سازی دسته‌ای تصاویر است. تغییرات در گزینه‌ها به همه تصاویر اعمال خواهد شد.",
    resizeLable: "تغییر اندازه تصویر",
    jpegLable: "پارامترهای JPEG/WEBP",
    pngLable: "پارامترهای PNG",
    gifLable: "پارامترهای GIF",
    avifLable: "پارامترهای AVIF",
    resizePlaceholder: "حالت تنظیم را انتخاب کنید",
    fitWidth: "تنظیم عرض، ارتفاع به طور خودکار مقیاس می‌شود",
    fitHeight: "تنظیم ارتفاع، عرض به طور خودکار مقیاس می‌شود",
    setShort: "تنظیم ضلع کوتاه، ضلع بلند به طور خودکار مقیاس می‌شود",
    setLong: "تنظیم ضلع بلند، ضلع کوتاه به طور خودکار مقیاس می‌شود",
    setCropRatio: "حالت برش، نسبت برش را تنظیم کنید",
    setCropSize: "حالت برش، اندازه برش را تنظیم کنید",
    cwRatioPlaceholder: "نسبت عرض را تنظیم کنید",
    chRatioPlaceholder: "نسبت ارتفاع را تنظیم کنید",
    cwSizePlaceholder: "عرض برش را تنظیم کنید",
    chSizePlaceholder: "ارتفاع برش را تنظیم کنید",
    widthPlaceholder: "عرض تصویر خروجی را تنظیم کنید",
    heightPlaceholder: "ارتفاع تصویر خروجی را تنظیم کنید",
    shortPlaceholder: "طول ضلع کوتاه تصویر خروجی را تنظیم کنید",
    longPlaceholder: "طول ضلع بلند تصویر خروجی را تنظیم کنید",
    resetBtn: "بازنشانی گزینه‌ها",
    confirmBtn: "اعمال گزینه‌ها",
    qualityTitle: "تنظیم کیفیت تصویر خروجی (0-1)",
    colorsDesc: "تنظیم تعداد رنگ‌های خروجی (2-256)",
    pngDithering: "تنظیم ضریب دانه‌بندی (0-1)",
    gifDithering: "فعال کردن دانه‌بندی",
    avifQuality: "تنظیم کیفیت تصویر خروجی (1-100)",
    avifSpeed: "تنظیم سرعت فشرده‌سازی (1-10)",
    outputFormat: "تنظیم فرمت خروجی",
    outputFormatPlaceholder: "فرمت تصویر خروجی را انتخاب کنید",
    transparentFillDesc: "انتخاب رنگ شفاف",
    cropCompareWarning: "حالت برش از پیش‌نمایش مقایسه پشتیبانی نمی‌کند",
  },
  error404: {
    backHome: "بازگشت به خانه",
    description: "متاسفانه صفحه‌ای که بازدید کردید وجود ندارد",
  },
  progress: {
    before: "قبل از فشرده‌سازی",
    after: "بعد از فشرده‌سازی",
    rate: "نسبت کاهش",
  },
};

export default localeData;
