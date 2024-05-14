// 韩语

import { LocaleData } from "./type";
import koKR from "antd/locale/ko_KR";

const localeData: LocaleData = {
  antLocale: koKR,
  logo: "Pic Smaller",
  initial: "초기화 중",
  bundleTip: "포장",
  uploadCard: {
    title: "여기에서 로컬 이미지 파일을 선택하거나 드래그하세요.",
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
    resize: "이미지 크기 조정",
    title: "압축 옵션",
    unChanged: "크기 조정 없음",
    toWidth: "너비에 맞춰 조정",
    toHeight: "높이에 맞춰 조정",
    widthPlaceholder: "압축된 이미지 너비 설정",
    heightPlaceholder: "압축된 이미지의 높이를 설정합니다",
    resetBtn: "재설정 옵션",
    confirmBtn: "옵션 적용",
    qualityTitle: "출력 이미지 품질 설정(0-1)",
    colorsDesc: "출력 색상 수 설정(2-256)",
    pngDithering: "디더링 계수 설정(0-1)",
    gifDithering: "디더링 켜기",
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
