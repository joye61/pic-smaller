import { LocaleData } from "@/type";
import trTR from "antd/locale/tr_TR";

const localeData: LocaleData = {
  antLocale: trTR,
  logo: "Pic Smaller",
  initial: "Başlatılıyor",
  previewHelp:
    "Sıkıştırma etkisini karşılaştırmak için bölme çizgisini sürükleyin: soldaki orijinal görüntü, sağdaki sıkıştırılmış görüntü",
  uploadCard: {
    title: "Dosyaları buradan seçin, dosya ve klasör sürüklemeyi destekler",
    subTitle:
      "Açık kaynaklı toplu resim sıkıştırma aracı, %s formatını destekler",
  },
  listAction: {
    batchAppend: "Toplu ekle",
    addFolder: "Klasör ekle",
    clear: "Hepsini temizle",
    downloadAll: "Hepsini İndir",
    downloadOne: "İndir",
    removeOne: "Sil",
    reCompress: "Yeniden sıkıştır",
  },
  columnTitle: {
    status: "Durum",
    name: "İsim",
    preview: "Önizleme",
    size: "Boyut",
    dimension: "Boyut",
    decrease: "Sıkıştır",
    action: "Eylem",
    newSize: "Yeni boyut",
    newDimension: "Yeni boyutlar",
  },
  optionPannel: {
    failTip:
      "Daha küçük olamaz, lütfen parametreleri ayarlayın ve tekrar deneyin.",
    help: "Pic Smaller, toplu resim sıkıştırma uygulamasıdır. Seçeneklerde yapılan değişiklikler tüm resimlere uygulanacaktır.",
    resizeLable: "Görüntüyü yeniden boyutlandır",
    jpegLable: "JPEG/WEBP parametreleri",
    pngLable: "PNG parametreleri",
    gifLable: "GIF parametreleri",
    avifLable: "AVIF parametreleri",
    resizePlaceholder: "Ayarlama modunu seçin",
    fitWidth: "Genişliği ayarla, yükseklik otomatik ayarlanır",
    fitHeight: "Yüksekliği ayarla, genişlik otomatik ayarlanır",
    setShort: "Kısa kenarı ayarla, uzun kenar otomatik ayarlanır",
    setLong: "Uzun kenarı ayarla, kısa kenar otomatik ayarlanır",
    widthPlaceholder: "Çıktının genişliğini ayarlayın",
    heightPlaceholder: "Çıktının yüksekliğini ayarlayın",
    shortPlaceholder: "Çıktının kısa kenar uzunluğunu ayarlayın",
    longPlaceholder: "Çıktının uzun kenar uzunluğunu ayarlayın",
    resetBtn: "Seçenekleri sıfırla",
    confirmBtn: "Seçenekleri uygula",
    qualityTitle: "Çıktının kalitesini ayarla (0-1)",
    colorsDesc: "Çıktınun renk sayısını ayarla (2-256)",
    pngDithering: "Dithering katsayısını ayarla (0-1)",
    gifDithering: "Dithering'i aç",
    avifQuality: "Çıktının kalitesini ayarla (1-100)",
    avifSpeed: "Sıkıştırma hızını ayarla (1-10)",
    outputFormat: "Çıktı formatını ayarla",
    outputFormatPlaceholder: "Çıktı formatını seçin",
    transparentFillDesc: "Şeffaflık rengini seçin",
  },
  error404: {
    backHome: "Ana sayfaya dön",
    description: "Üzgünüz, ziyaret ettiğiniz sayfa mevcut değil~",
  },
  progress: {
    before: "Sıkıştırmadan önce",
    after: "Sıkıştırmadan sonra",
    rate: "Sıkıştırma oranı",
  },
};

export default localeData;
