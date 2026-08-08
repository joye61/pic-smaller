# Pic Smaller (图小小)

[English](../../README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja-JP.md) · [한국어](README.ko-KR.md) · [Français](README.fr-FR.md) · [Español](README.es-ES.md) · [فارسی](README.fa-IR.md) · [Türkçe](README.tr-TR.md)

> [!IMPORTANT]
> ### Pic Smaller Desktop — 플래그십 에디션
> **타협 없는 네이티브 파워, 브라우저의 한계를 넘어서.**
>
> 플래그십 Pic Smaller Desktop으로 워크플로를 한 단계 끌어올리세요. 타협을 거부하는 전문가를 위해 설계된 전용 네이티브 애플리케이션으로, 대용량 파일과 전체 폴더 라이브러리를 손쉽게 처리하며 16가지 이상의 이미지 형식을 지원하고 탁월한 처리 성능을 제공합니다. 배경 제거, 워터마크 제거, 고품질 이미지 업스케일링 등 고급 AI 도구 모음까지 갖추어 완벽한 경험을 선사합니다.
>
> [![Pic Smaller Desktop 살펴보기](https://img.shields.io/badge/Explore_Pic_Smaller_Desktop-00876c?style=for-the-badge)](https://desktop.picsmaller.com/)

Pic Smaller는 전적으로 브라우저에서 실행되는 무료 오픈소스 배치 이미지 압축 도구입니다.
이미지는 Web Workers, WebAssembly, Canvas 및 브라우저 코덱을 통해 로컬에서 처리되며,
파일이 애플리케이션 서버로 업로드되는 일은 절대 없습니다.

호스팅된 앱은 [picsmaller.com](https://picsmaller.com/) 또는
[www.picsmaller.com](https://www.picsmaller.com/)에서 사용할 수 있습니다.

## 기능

- JPEG, PNG, WebP, GIF, SVG, AVIF 이미지 일괄 압축.
- HEIC 및 HEIF 입력을 로컬에서 디코딩하고 JPEG, PNG, WebP, AVIF로 내보내기.
- 포맷 변환, 크기 조정, 자르기 및 인코더별 품질 옵션 제어.
- 파일 선택기, 폴더 선택기, 드래그 앤 드롭, 클립보드 붙여넣기로 파일 추가.
- 인터랙티브 분할 보기로 원본과 압축된 이미지 비교.
- 개별 결과 다운로드 또는 전체 배치를 ZIP 아카이브로 저장.
- 개인정보 보호: 모든 처리는 사용자 기기에서 이루어집니다.

## 스크린샷

![Pic Smaller 압축 작업 공간](../demo1.png)

핵심 작업 공간은 배치 입력, 압축 결과, 출력 설정 및 다운로드 작업을
하나의 뷰에 통합합니다.

## 개발

요구사항:

- Node.js 22 LTS 이상
- npm 10 이상

```bash
git clone https://github.com/joye61/pic-smaller.git
cd pic-smaller
npm ci
npm run dev
```

유용한 명령어:

```bash
npm test            # 테스트 스위트 실행
npm run lint        # ESLint 실행
npm run build       # 독립형 Node.js 서버 빌드
npm run build:pages # Cloudflare Pages 정적 사이트를 out/으로 내보내기
```

## 배포

### Cloudflare Pages

공개 사이트는 GitHub 저장소 통합으로 Cloudflare Pages를 사용합니다.
Cloudflare는 다음 설정으로 사이트를 자동으로 빌드하고 배포합니다:

| 설정 | 값 |
| --- | --- |
| 프로덕션 브랜치 | `master` |
| 프리뷰 브랜치 | `develop` |
| 빌드 명령어 | `npm run build:pages` |
| 출력 디렉토리 | `out` |
| Node.js 버전 | `22` |

`master` 푸시는 프로덕션을 업데이트합니다. `develop` 푸시는 프리뷰 배포를 생성합니다.
다른 브랜치는 자동으로 배포되지 않습니다.

Pages 빌드는 Next.js가 생성한 최상위 `404.html`을 제거하여
Cloudflare Pages가 네이티브 단일 페이지 애플리케이션 폴백을 적용할 수 있도록 합니다.

### Docker

Docker 이미지는 프라이빗 또는 자체 호스팅 배포를 위한 대안입니다.
Next.js 독립형 출력을 사용하며, 비특권 `node` 사용자로 실행되고,
`tini`를 통해 시그널을 처리하며, 컨테이너 헬스 체크를 포함합니다.

```bash
docker build --pull -t pic-smaller:latest .

docker run -d \
  --name pic-smaller \
  --restart unless-stopped \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  -p 127.0.0.1:3000:3000 \
  pic-smaller:latest
```

`http://127.0.0.1:3000`을 엽니다. 공개 액세스를 위해서는 Caddy, nginx,
Traefik과 같은 TLS 종료 리버스 프록시 뒤에 컨테이너를 배치하세요.
직접 네트워크 노출이 의도적인 경우에만 `127.0.0.1:` 바인드 접두사를 제거하세요.

### 시크릿 및 구성

이 웹 애플리케이션은 API 키가 필요하지 않습니다.
자격 증명, Cloudflare 토큰, `.env` 파일, `.dev.vars`, 개인 키,
로컬 Wrangler 상태를 절대 커밋하지 마세요.
저장소 무시 규칙은 이러한 파일을 제외합니다.
향후 기능에 시크릿이 필요하면 배포 플랫폼의 시크릿 관리자에 저장하고
`.env.example` 파일에 문서화된 플레이스홀더 이름만 제공하세요.

## 프로젝트 구조

- `src/app/`: Next.js 애플리케이션 진입점.
- `src/components/`: 재사용 가능한 인터페이스 구성 요소.
- `src/engines/`: 브라우저 코덱, 워커, 변환 및 압축 큐.
- `src/locales/`: 번역.
- `src/views/`: 애플리케이션 뷰.
- `public/`: 빌드 중 준비되는 브라우저 코덱 및 WebAssembly 자산.
- `scripts/`: 코덱 준비 및 배포 빌드 도우미.
- `tests/`: Node.js 테스트 스위트.

## 기여하기

1. `develop`에서 브랜치를 생성하세요.
2. `npm test`, `npm run lint`, 관련 프로덕션 빌드를 실행하세요.
3. 동작이나 인터페이스 변경 시 문서와 스크린샷을 업데이트하세요.
4. 명확한 설명과 검증 노트가 포함된 집중된 Pull Request를 제출하세요.

## 라이선스

Pic Smaller는 [MIT 라이선스](./LICENSE)에 따라 제공됩니다.

## 감사의 말

- [Squoosh Kit](https://github.com/bnowak008/squoosh-kit) — AVIF, ImageQuant, OxiPNG 코덱.
- [heic-to](https://github.com/hoppergee/heic-to) — 브라우저 측 HEIC 및 HEIF 디코딩.
- [SVGO](https://github.com/svg/svgo) — SVG 최적화.
- [gifsicle-wasm-browser](https://github.com/renzhezhilu/gifsicle-wasm-browser) — GIF 압축.
