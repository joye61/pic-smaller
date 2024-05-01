// 俄语

import { LocaleData } from "./type";
import ruRU from "antd/locale/ru_RU";

const localeData: LocaleData = {
  antLocale: ruRU,
  logo: "Pic Smaller",
  readFileTip: "Чтение",
  bundleTip: "Упаковка",
  uploadCard: {
    title: "Перетащите или нажмите, чтобы загрузить",
    subTitle: ["Поддержка", "Формат"],
  },
  listAction: {
    batchAppend: "Пакетное добавление",
    clear: "Очистить список",
    downloadAll: "Загрузить все",
    downloadOne: "Загрузить картинку",
    removeOne: "Удалить картинку",
    reCompress: "пересжать",
  },
  columnTitle: {
    status: "статус",
    name: "имя файла",
    preview: "Предварительный просмотр",
    size: "размер",
    dimension: "размер",
    decrease: "Коэффициент сжатия",
    action: "действовать",
    newSize: "новый размер",
    newDimension: "Новое измерение",
  },
  optionPannel: {
    title: "Параметры сжатия",
    unChanged: "Без масштабирования",
    toWidth: "Адаптироваться к ширине",
    toHeight: "Адаптироваться к высоте",
    widthPlaceholder: "Установить ширину сжатого изображения",
    heightPlaceholder: "Установить высоту сжатого изображения",
    qualityTitle: "Установите качество сжатия (0-100): чем больше значение, тем больше будет создаваемое изображение",
    resetBtn: "перезагрузить",
    confirmBtn: "Конечно",
    enableHighPng: "Включить высококачественное сжатие типа PNG",
    highPngDither: "Установите коэффициент дизеринга (0-100): чем больше значение, тем больше шума, но тем более плавное изображение",
  },
  error404: {
    backHome: "Вернуться на домашнюю страницу",
    description: "Извините, страница, которую вы посетили, не существует~",
  },
  progress: {
    before: "до сжатия",
    after: "После сжатия",
    rate: "Коэффициент сжатия",
  }
};

export default localeData;
