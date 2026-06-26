# 컴포넌트 인벤토리 (자동 생성)

> 자동 생성 파일 — 직접 수정 금지. `/gc`·`/health`·kiro-build가 코드를 스캔해 갱신한다.
> 홈(`features/home`)·내 모임(`features/meetings`)·알림(`features/notifications`)은 실제 화면으로 구현됨(issue #9, #12, #15). 나머지 탭/스택은 아직 placeholder.

## 공용 컴포넌트 (`src/components/`)

| 컴포넌트             | 경로                              | 분류               | props 수 | 사용처                             |
| -------------------- | --------------------------------- | ------------------ | -------- | ---------------------------------- |
| Button               | `src/components/Button.tsx`       | 프레젠테이션       | 5        | 기본 버튼(primary/outline variant) |
| Card                 | `src/components/Card.tsx`         | 프레젠테이션       | 3        | 흰 카드 컨테이너(테두리·그림자)    |
| Chip / ToggleChip    | `src/components/Chip.tsx`         | 프레젠테이션       | 3 / 3    | 필터칩 / 토글 선택칩               |
| Avatar / AvatarStack | `src/components/Avatar.tsx`       | 프레젠테이션       | 3 / 1    | 참여자 아바타 / 겹친 아바타 묶음   |
| Icon                 | `src/components/Icon.tsx`         | 프레젠테이션       | 3        | Material 아이콘 래퍼               |
| Input                | `src/components/Input.tsx`        | 프레젠테이션       | 7        | 텍스트 입력(라벨·에러)             |
| FAB                  | `src/components/FAB.tsx`          | 프레젠테이션       | 2        | 플로팅 액션 버튼                   |
| ProgressRing         | `src/components/ProgressRing.tsx` | 프레젠테이션       | 6        | 원형 진행률(탄소·리포트)           |
| SectionSlab          | `src/components/SectionSlab.tsx`  | 프레젠테이션       | 2        | 섹션 구분 슬래브(8px)              |
| Segmented            | `src/components/Segmented.tsx`    | 프레젠테이션       | 3        | 세그먼트 컨트롤(탭 전환)           |
| SheetBase            | `src/components/SheetBase.tsx`    | 프레젠테이션       | 4        | 바텀시트 베이스                    |
| SkillChip            | `src/components/SkillChip.tsx`    | 프레젠테이션       | 2        | 요리 실력 칩(상/중/하)             |
| StatusBadge          | `src/components/StatusBadge.tsx`  | 프레젠테이션       | 3        | 홈 추천/열린 방 카드 배지          |
| Placeholder          | `src/components/Placeholder.tsx`  | 프레젠테이션(골격) | 4        | 미구현 placeholder 라우트          |

> StatusBadge: `size` prop으로 `'md'`(기본, 목록 카드 11px) / `'sm'`(추천 카드 10.5px·radius 7) 변형 지원.
> SkillChip도 `size` prop(`'sm'`/`'md'`) 지원. 공용 컴포넌트 14종은 issue #7(commit 67557b3)에서 구현됨.

## 화면 컴포넌트 (`src/features/`)

| 컴포넌트            | 경로                                                 | 분류          | props 수 | 사용처                    |
| ------------------- | ---------------------------------------------------- | ------------- | -------- | ------------------------- |
| HomeScreen          | `src/features/home/HomeScreen.tsx`                   | 혼합형(훅+UI) | 0        | `(tabs)/home` 라우트      |
| LocationSheet       | `src/features/home/LocationSheet.tsx`                | 프레젠테이션  | 4        | HomeScreen (지역 필터)    |
| MeetingsScreen      | `src/features/meetings/MeetingsScreen.tsx`           | 혼합형(훅+UI) | 0        | `(tabs)/meetings` 라우트  |
| MyApplicationScreen | `src/features/meetings/MyApplicationScreen.tsx`      | 혼합형(훅+UI) | 0        | `myApplication` 라우트    |
| NotifDropdown       | `src/features/notifications/NotifDropdown.tsx`       | 오버레이      | 3        | HomeScreen (탑바 벨 토글) |
| NotificationsScreen | `src/features/notifications/NotificationsScreen.tsx` | 혼합형(훅+UI) | 0        | `notifications` 라우트    |

> HomeScreen: `useNotifications()`의 `unreadCount`로 미읽음 dot 표시, 벨 탭 시 NotifDropdown 토글.
> MeetingsScreen(PRD §3.8): `useMyApplications()`·`usePastMeetings()`·`useNotifications()` 훅 경유. 캘린더 그리드는 `src/features/meetings/calendar.ts`(순수 함수).
> MyApplicationScreen(PRD §3.9): `useMyApplication(id)`·`usePartyPool()`·`useVoteMenus()`·`useDecidedMenu()` 훅 경유. stage(canceled/recruiting/voting/result)는 화면 로컬 파생. theme `applicationStage` 토큰 그룹(투표/결과 단계 전용 색).
> NotifDropdown props: `visible` · `onClose` · `onOpenPage`. 최대 5행, popIn 200ms 애니메이션.
> NotificationsScreen: 전체 알림 목록, "모두 읽음" 버튼, 타입별 라우팅(eval→pastEval, 그 외→myApplication).

## 상태 스토어 (`src/stores/`)

| 스토어     | 경로                       | 상태/액션                                                        |
| ---------- | -------------------------- | ---------------------------------------------------------------- |
| notifStore | `src/stores/notifStore.ts` | `notifRead: Record<string,boolean>` · `markRead` · `markAllRead` |

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
