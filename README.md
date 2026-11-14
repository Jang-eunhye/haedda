# 해따 (haedda)

할일을 끝내면 스티커(별)를 모으고, 모은 스티커로 나에게 보상을 주는 할일 앱이에요.
웹(Next.js)과 모바일 앱(Expo, 안드로이드·iOS)을 하나의 모노레포에서 함께 관리해요.

## 구조

```
apps/
  web/       Next.js 웹 앱
  mobile/    Expo 앱 (안드로이드·iOS)
packages/
  types/     공용 타입
  constants/ 공용 상수 (저장소 키 등)
  utils/     날짜·반복·필터 등 순수 함수
  domain/    할일·보상·스티커 규칙
  storage/   저장소 (웹 localStorage / 앱 AsyncStorage 어댑터)
  hooks/     useTodos, useCategories 등 공용 React 훅
```

데이터는 서버 없이 기기 안(웹은 localStorage, 앱은 AsyncStorage)에만 저장돼요.

## 실행

pnpm 9와 Node 22를 사용해요.

```bash
pnpm install

pnpm dev:web      # 웹 개발 서버 (http://localhost:3000)
pnpm dev:mobile   # Expo 개발 서버 (Expo Go 앱으로 QR 스캔)
pnpm typecheck    # 전체 타입 검사
pnpm test         # 핵심 로직 테스트 (Node 22 내장 테스트 러너, 설치 없이도 실행 가능)
```

## 테스트

`tests/` 아래에 날짜·반복·필터·할일 완료·보상 로직 테스트가 있어요. 새 패키지 없이 Node 내장 테스트 러너(`node --test`)와
`scripts/ts-test-loader.mjs`(워크스페이스 경로와 확장자 없는 import를 풀어주는 로더)로 TS 소스를 바로 실행해요.
날짜는 `tests/helpers.ts`의 `freezeTime()`으로 2026년 11월 14일(토)에 고정하고, 시간대는 Asia/Seoul로 맞춰요.
PR을 올리면 GitHub Actions에서 자동으로 돌아요.

## 앱 빌드 (EAS)

`apps/mobile`에서 실행해요. 처음 한 번은 `npx eas-cli login`과 `npx eas-cli init`이 필요해요.

| 프로필 | 용도 |
| --- | --- |
| `preview` | 안드로이드 APK(폰에 바로 설치), iOS 시뮬레이터 빌드 |
| `development` | 개발용 클라이언트 |
| `production` | 스토어 제출용 (안드로이드 AAB, iOS) |

```bash
cd apps/mobile
npx eas-cli build --profile preview --platform android
npx eas-cli build --profile production --platform all
npx eas-cli submit --platform ios   # TestFlight / App Store
```

- 안드로이드 패키지명, iOS 번들 ID: `com.eunhye99.haedda`
- iOS 빌드와 제출에는 Apple Developer 계정이 필요해요 (맥은 없어도 돼요).
