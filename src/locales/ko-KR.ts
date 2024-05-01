// 韩语

import { LocaleData } from "./type";
import koKR from "antd/locale/ko_KR";

const localeData: LocaleData = {
  antLocale: koKR,
  logo: "Pic Smaller",
  readFileTip: "읽는 중",
  bundleTip: '포장',
  uploadCard: {
    title: "업로드하려면 드래그 앤 드롭하거나 클릭하세요.",
    subTitle: ["지원", "형식"],
  },

  listAction: {
    batchAppend: "일괄 추가",
    clear: "목록 지우기",
    downloadAll: "모두 다운로드",
    downloadOne: "사진 다운로드",
    removeOne: "사진 제거",
    reCompress: "재압축",
  },
  columnTitle: {
    status: "상태",
    name: "파일 이름",
    preview: "미리보기",
    size: "크기",
    dimension: "크기",
    decrease: "압축 비율",
    action: "액션",
    newSize: "새 크기",
    newDimension: "새 차원",
  },
  optionPannel: {
    title: "압축 옵션",
    unChanged: "크기 조정 없음",
    toWidth: "너비에 맞춰 조정",
    toHeight: "높이에 맞춰 조정",
    widthPlaceholder: "압축된 이미지 너비 설정",
    heightPlaceholder: "압축된 이미지의 높이를 설정합니다",
    qualityTitle:
      "압축 품질 설정(0-100): 값이 클수록 생성되는 이미지가 커집니다.",
    resetBtn: "재설정",
    confirmBtn: "확인",
    enableHighPng: "PNG 유형의 고품질 압축을 활성화합니다",
    highPngDither:
      "디더 계수 설정(0-100): 값이 클수록 노이즈는 많아지지만 이미지는 더 부드러워집니다.",
  },
  error404: {
    backHome: "홈 페이지로 돌아가기",
    description: "죄송합니다. 방문하신 페이지는 존재하지 않습니다~",
  },
  progress: {
    before: "압축 전",
    after: "압축 후",
    rate: "압축률",
  },
};

export default localeData;
