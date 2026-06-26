# 컴포넌트 인벤토리 (자동 생성)

> 자동 생성 파일 — 직접 수정 금지. `/gc`·`/health`·kiro-build가 코드를 스캔해 갱신한다.
> 네비게이션 골격(issue #2) 이후 화면 구현 진행 중. 홈(`features/home`)은 placeholder에서 실제 화면으로 교체됨(issue #9). 나머지 탭/스택은 아직 placeholder.

## 공용 컴포넌트 (`src/components/`)

| 컴포넌트    | 경로                             | 분류               | props 수 | 사용처                    |
| ----------- | -------------------------------- | ------------------ | -------- | ------------------------- |
| StatusBadge | `src/components/StatusBadge.tsx` | 프레젠테이션       | 3        | 홈 추천/열린 방 카드 배지 |
| Placeholder | `src/components/Placeholder.tsx` | 프레젠테이션(골격) | 4        | 미구현 placeholder 라우트 |

> StatusBadge: `size` prop으로 `'md'`(기본, 목록 카드 11px) / `'sm'`(추천 카드 10.5px·radius 7) 변형 지원.
> 그 외 공용 컴포넌트(Button·Card·Chip/ToggleChip·Avatar/AvatarStack·Icon·Input·FAB·ProgressRing·SectionSlab·Segmented·SheetBase·SkillChip — issue #7 commit 67557b3)는 아직 이 표에 미반영(후속 갱신 대상).

## 화면 컴포넌트 (`src/features/`)

| 컴포넌트      | 경로                                  | 분류          | props 수 | 사용처                 |
| ------------- | ------------------------------------- | ------------- | -------- | ---------------------- |
| HomeScreen    | `src/features/home/HomeScreen.tsx`    | 혼합형(훅+UI) | 0        | `(tabs)/home` 라우트   |
| LocationSheet | `src/features/home/LocationSheet.tsx` | 프레젠테이션  | 4        | HomeScreen (지역 필터) |

> HomeScreen은 `useHomeRooms()`(추천/열린 방 카드)·`useMe()`(추천 헤더)·`useNotifications()`(알림 dot) 훅으로만 데이터에 접근한다(PRD §3.3 · §3.16).
> LocationSheet props: `visible` · `selected` · `onSelect` · `onClose`. 표시/선택 상태는 HomeScreen이 소유한다(프레젠테이션).

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
