# FRONTEND.md — 프론트엔드 코드 컨벤션

> 이 문서의 역할: KiroZero 프론트엔드의 "코드를 어떻게 쓰고 구조화하는가"의 기준. 에이전트는 새 코드를 이 패턴에 맞춘다.
> 기준은 `FRONTEND_PRD.md` + `src/theme/theme.ts`에서 도출됐다(핸드오프가 HTML 프로토타입이라 RN 기준 패턴은 여기서 처음 확립한다).

## 1. 기술 스택 (확정)

- Expo SDK 56 · React Native 0.85 · React 19 · TypeScript strict.
- 네비게이션: **Expo Router**(파일 기반). 상태: **Zustand**(도메인별) + 화면-로컬 `useState`.
- 스타일: `src/theme/theme.ts` 토큰 + `StyleSheet.create`. 폼: `useState` 직접 관리.
- 라이트 모드 전용(다크모드 미지원).

## 2. 폴더 구조 (도메인/feature 기반)

```
src/
├── app/            ← Expo Router 라우트만. (auth) 그룹 + (tabs) + stack 화면.
├── features/       ← 도메인별 화면·전용 훅·전용 컴포넌트
│   ├── auth/       (login, signup)
│   ├── home/       (home, location sheet)
│   ├── room/       (roomDetail, recommend, usage, settlement, join sheet)
│   ├── meetings/   (meetings, myApplication, pastApplication, pastEval)
│   ├── report/     (report)
│   └── my/         (my, editProfile)
├── components/     ← 도메인 무관 공용 컴포넌트 (Button, Chip, Card, StatusBadge, Avatar, Segmented, SheetBase ...)
├── stores/         ← Zustand 도메인 스토어 (authStore, roomStore, evalStore, notifStore ...)
├── hooks/          ← 도메인 무관 공용 훅
├── data/           ← 더미데이터 시드 (PRD §5). 백엔드 붙으면 삭제, 타입은 유지.
├── lib/            ← 순수 유틸·파생 계산 (validators, format, derive, emojiGuess ...)
├── types/          ← 공유 타입 (PRD §5 shape)
└── theme/          ← theme.ts (디자인 토큰 단일 출처)
```

- 도메인 전용 컴포넌트는 `features/{도메인}/components/`. 2개 이상 도메인이 쓰면 `src/components/`로 승격.

### 2.1 네비게이션 골격 (issue #2 구현)

- 엔트리포인트는 `expo-router/entry`(`package.json` main). `app.json`: `plugins: ["expo-router"]`, `scheme: "kirozero"`, `experiments.typedRoutes: true`. babel은 `babel-preset-expo`.
- 라우트 루트는 `src/app/`. 구조: `(auth)/login·signup`(탭바·백스택 없음) · `(tabs)/home·meetings·report·my`(4탭) · 나머지는 root stack에 push되며 탭바를 가린다(roomDetail·recommend·usage·settlement·myApplication·pastApplication·pastEval·editProfile·notifications).
- 부팅 진입: `index.tsx` → `(auth)/login` 리다이렉트. 로그인 성공 → `(tabs)/home`(현재는 골격 버튼, 인증 스토어는 후속 이슈).
- 탭바: 활성 `color.brand` + filled / 비활성 `color.textFaint2` + outline 아이콘(Ionicons). 색은 theme 토큰만 사용.
- 화면은 모두 `src/components/Placeholder.tsx`(빈 SafeAreaView + 화면명)로 채워져 있고, 후속 화면 이슈에서 `features/{도메인}`의 실제 화면으로 교체된다.

## 3. 컴포넌트 패턴 (혼합형)

- **공용 컴포넌트(`src/components/`)는 프레젠테이션** — props만 받고 로직/데이터 페칭 없음.
- **화면 컴포넌트(`features/`)는 컨테이너** — 훅으로 데이터·상태를 받아 공용 컴포넌트에 내려준다.
- 한 파일 한 컴포넌트(공용). 파일명·컴포넌트명 PascalCase(`RoomCard.tsx`). 훅은 `useXxx.ts`(camelCase).
- 파일 내부 순서: import → 타입 → 컴포넌트 → `StyleSheet.create(styles)`.

## 4. import 순서

1. React / React Native, 2. 외부 라이브러리(expo-\*, zustand 등), 3. 절대경로 내부(`src/`), 4. 상대경로.
   그룹 사이 한 줄 공백. (Prettier + eslint-config-expo가 일부 자동 정리.)

## 5. 상태 관리

| 종류            | 도구                                      | 예                                            |
| --------------- | ----------------------------------------- | --------------------------------------------- |
| UI 상태         | `useState`                                | 모달 열림, 탭 선택, 포커스                    |
| 전역(내비 생존) | Zustand 도메인 스토어                     | authed, me, allergies, notifRead, reportMonth |
| 폼              | `useState` (PRD §4.2 shape)               | authEmail, joinIngredients, evalFood          |
| 서버 상태       | (현재 없음) 더미 훅 → 추후 TanStack Query | useRooms()                                    |

- 스토어는 도메인별 분리(슬라이스 X). 액션은 스토어 안에 정의. 셀렉터로 필요한 값만 구독.

## 6. 데이터 페칭 / 더미데이터

- `src/data/`의 시드를 **직접 import 금지**. 반드시 `useRooms()`, `useRoomDetail(id)`, `useNotifications()` 같은 훅으로 감싼다.
- 훅이 로딩/에러/빈 상태를 반환하도록 설계해, 백엔드 연동 시 훅 내부만 API 호출로 교체한다(PRD §5).
- **API 연동은 반드시 `docs/API-INTEGRATION.md` 절차를 따른다**: 코드 작성 전 백엔드 Swagger를 먼저 확인하고 `docs/generated/api-schema.md`와 대조해 **일치할 때만** 구현한다. 불일치를 추측으로 메우지 않는다.

## 7. 파생 계산 (PRD §4.3 — `src/lib/derive.ts`에 모음, 정확히 복제)

- 환급 점수 = `40 + round(30*avgIngredientUse/100) + round(30*food/100)`
- 환급 나뭇잎 = `round(2000 * 0.5 * score/100)`
- 리포트 co2 = `saved * 2.5` (kg)
- 이메일 도메인 = `/@(inha\.ac\.kr|inha\.edu)$/i`
- 돈 표기 = `value.toLocaleString('ko-KR') + '원'`
- 방 상태 → 배지/좌석/CTA 분기(§3.4)는 한 함수(`roomDisplay`)로 통일.

## 8. 금지 패턴

- ❌ 하드코딩 색상값(`#RRGGBB`) → `theme.ts` 토큰 (ESLint error)
- ❌ `any` → `unknown` + 타입 가드. `as unknown as X` 캐스팅 (ESLint error)
- ❌ `console.log` → `console.warn/error` 또는 `src/lib/logger.ts` (ESLint warn)
- ❌ `src/data/` 직접 import → 커스텀 훅 경유
- ❌ 인라인 매직넘버 간격/라운딩 → `space`/`radius` 토큰
- ❌ HTML 프로토타입의 폰 베젤/상태바 재현 → `SafeAreaView` 사용
- ❌ 한국어 카피 임의 변경 → PRD 문자열 그대로

## 9. 접근성

- 히트 타깃 ≥ 44px(FAB 56, 아이콘 38px 탭존). 비활성 버튼은 회색으로 **보이게**(숨기지 않음).
