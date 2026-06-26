# 컴포넌트 인벤토리 (자동 생성)

> 자동 생성 파일 — 직접 수정 금지. `/gc`·`/health`·kiro-build가 코드를 스캔해 갱신한다.
> 현재는 네비게이션 골격(issue #2)까지 진행된 상태. 화면은 placeholder이며, 후속 이슈에서 `features/{도메인}`의 실제 화면으로 교체된다.

## 공용 컴포넌트 (`src/components/`)

| 컴포넌트    | 경로                             | 분류               | props 수 | 사용처                  |
| ----------- | -------------------------------- | ------------------ | -------- | ----------------------- |
| Placeholder | `src/components/Placeholder.tsx` | 프레젠테이션(골격) | 4        | 모든 placeholder 라우트 |

## 라우트 (`src/app/` — Expo Router)

| 라우트           | 경로                          | 그룹   | 노출      |
| ---------------- | ----------------------------- | ------ | --------- |
| index (redirect) | `src/app/index.tsx`           | root   | → login   |
| login            | `src/app/(auth)/login.tsx`    | (auth) | 탭바 없음 |
| signup           | `src/app/(auth)/signup.tsx`   | (auth) | 탭바 없음 |
| home             | `src/app/(tabs)/home.tsx`     | (tabs) | 탭        |
| meetings         | `src/app/(tabs)/meetings.tsx` | (tabs) | 탭        |
| report           | `src/app/(tabs)/report.tsx`   | (tabs) | 탭        |
| my               | `src/app/(tabs)/my.tsx`       | (tabs) | 탭        |
| roomDetail       | `src/app/roomDetail.tsx`      | stack  | push      |
| recommend        | `src/app/recommend.tsx`       | stack  | push      |
| usage            | `src/app/usage.tsx`           | stack  | push      |
| settlement       | `src/app/settlement.tsx`      | stack  | push      |
| myApplication    | `src/app/myApplication.tsx`   | stack  | push      |
| pastApplication  | `src/app/pastApplication.tsx` | stack  | push      |
| pastEval         | `src/app/pastEval.tsx`        | stack  | push      |
| editProfile      | `src/app/editProfile.tsx`     | stack  | push      |
| notifications    | `src/app/notifications.tsx`   | stack  | push      |

> 탭바는 4탭(홈/내 모임/리포트/MY) — main 라우트에서만 노출(PRD §2.1). `fridge`·`admin`은 PRD에서 제거됨.
> PRD 기준 예정 인벤토리: 15 화면 + 3 오버레이 + 공용 컴포넌트(Button·Chip·Card·StatusBadge·Avatar·Segmented·SheetBase 등). 화면 구현 진행 시 채워진다.
