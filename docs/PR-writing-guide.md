# PR-writing-guide.md — PR 본문 작성 톤 가이드

> 이 문서의 역할: `.github/pull_request_template.md`가 참조하는 PR 작성 규칙.

## 원칙

1. **한 줄 요약 먼저.** 이 PR이 무엇을 하는지 한 문장으로.
2. **변경 사항은 "무엇을 / 왜 / 어떻게 쓰는지" 순**의 평이한 한국어.
3. **라이브러리 이름만 나열하는 줄 금지.** 예: ❌ "zustand 추가" → ✅ "전역 로그인 상태를 화면 이동 후에도 유지하려고 zustand 스토어(authStore)를 도입. 화면에서 `useAuthStore()`로 읽는다."
4. **자동 리뷰/검사 결과는 표로** 정리.
5. **base 브랜치는 `main`** (이 레포는 main 단일 전략).

## "직접 확인하는 법"

- 앱에서 확인할 항목만 적는다.
- `npm install` / `npx expo start` / `npm test` 같은 **범용 명령 블록은 넣지 않는다.** 이 변경에만 필요한 특수 명령이 있을 때만 적는다.

## 체크리스트

- ESLint + TypeScript 에러 없음.
- `npm test` 통과 — 신규 로직(`src/lib/`·`src/hooks/`·`src/stores/`)에 테스트 누락 없음(`docs/TESTING.md` 4축).
- 주요 플로우 직접 테스트.
- UI 변경 시 스크린샷(Before/After).

## 커밋

- Conventional Commits(`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`). 본문 한국어 가능.
- 머지 전략: **Squash and Merge.**
