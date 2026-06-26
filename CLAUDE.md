# KiroZero — 프로젝트 가이드

> 인하대 캠퍼스 **잉여 식재료 공동 요리 매칭 앱** (Expo / React Native, iOS + Android).
> 식재료 등록 → 4인 방 참여 → AI 메뉴 추천 → 투표 → 조리 → 사용량 기록 → 탄소 절감 리포트("나뭇잎" 보상).

@AGENTS.md

## 내 역할

- **프론트엔드 + 디자인** 담당. 백엔드/서버/DB는 다른 팀원 담당 → **범위 밖**(거부).

## 기술 스택

- Expo SDK 56, React Native 0.85, React 19, TypeScript (strict).
- 네비게이션: **Expo Router** (파일 기반). 상태: **Zustand**(도메인별 스토어) + 화면-로컬 useState.
- 스타일: `src/theme/theme.ts` 디자인 토큰(StyleSheet). 폼: useState 직접 관리. 라이트 모드 전용.
- 테스트: jest-expo. 린트/포맷: ESLint(flat) + Prettier.

## 코드 컨벤션 (핵심 5)

1. **디자인 토큰만 사용.** 색·폰트·간격은 `src/theme/theme.ts`에서 import. 하드코딩 색(`#RRGGBB`) 금지.
2. **폴더는 도메인(feature) 기반.** `src/app/`=라우트, `src/features/{도메인}/`=화면·훅, `src/components/`=공용.
3. **더미데이터는 커스텀 훅으로 감싼다.** UI는 `src/data/` 직접 import 금지 → `useRooms()` 등으로 접근(API 교체 대비).
4. **`any` 금지.** 불확실하면 `unknown` + 타입 가드. `as unknown as X` 캐스팅 금지.
5. **한국어 카피는 PRD/프로토타입 문자열 그대로.** 임의로 다시 쓰지 않는다.

> 상세: `docs/FRONTEND.md`(코드), `docs/DESIGN.md`(디자인), `docs/TESTING.md`(테스트), `docs/PR-writing-guide.md`(PR).

## .claude/ 구조

- **agents/** — `kiro-ui`(화면), `kiro-logic`(상태·데이터), `kiro-qa`(검증, 별도 세션·재시도 2회 제한).
- **skills/** (자동 트리거) — `kiro-build`(팀 구현 오케스트레이터), `github-issue-work`, `github-issue-create`, `harness-feedback`.
- **commands/** (수동 `/명령`) — `/review`, `/gc`, `/health`, `/quality`.

## GitHub 이슈 워크플로우

- **모든 작업은 GitHub 이슈 기반.** 작업 시작: "issue #번호 작업하자". 이슈 생성: "이슈 만들어줘"(`.github/ISSUE_TEMPLATE/` 따름).
- 브랜치: **main 단일**. 작업은 새 브랜치 → PR(base `main`) → Squash 머지. 커밋: Conventional Commits.

## 자동 교정 루프

- 파일 저장 시 **PostToolUse Hook**이 자동 `eslint --fix` + `tsc`. 에러는 컨텍스트에 주입되니 **스스로 수정**한다.
- 같은 규칙이 3회+ 반복되면 `harness-feedback`로 규칙을 승격(문서→린트→교정지시→구조테스트).

## 현재 작업

- 진행 중 작업 계획: `docs/exec-plans/` 참조.
