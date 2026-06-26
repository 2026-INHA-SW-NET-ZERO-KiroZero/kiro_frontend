# /review — 코드 리뷰 워크플로우

변경된 파일을 전부 분석해서 다음 항목을 체크한다.

## 1. Hook 통과 확인

- 모든 변경 파일에서 PostToolUse Hook(eslint --fix + tsc)이 통과했는지 확인.
- Hook이 자동 수정한 내역을 로그로 남긴다.

## 2. docs/ 규칙 대조

- `docs/FRONTEND.md`, `docs/DESIGN.md` 규칙 vs 변경 코드.
- Hook이 못 잡는 고수준 규칙 검증:
  - 공용 컴포넌트(`src/components/`) 재사용 여부
  - 에러/빈/로딩 UI 존재 여부
  - 디자인 토큰(`src/theme/theme.ts`) 준수, 하드코딩 색 없음
  - `SafeAreaView` 사용, 한국어 카피 PRD 일치
  - 더미데이터를 커스텀 훅으로 감쌌는지

## 3. 반복 패턴 감지

- 이전 리뷰와 동일 패턴 재발 시 harness-feedback 제안.
- "이 패턴을 ESLint 규칙(Level 2)으로 승격할까요?"
- "교정 지시를 업데이트할까요?"(Level 2.5)

## 4. 결과 분류 보고

- `critical` / `warning` / `info` / `suggestion`으로 분류해 보고.

> **중요:** QA 검증은 반드시 **kiro-qa를 별도 서브에이전트(새 컨텍스트)**로 실행한다. 코드를 작성한 에이전트가 자기 코드를 리뷰하면 편향된다. 재시도는 최대 2회로 제한한다.
