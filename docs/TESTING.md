# TESTING.md — 테스트 전략

> 이 문서의 역할: KiroZero 프론트엔드 테스트의 범위와 4축 기준. PR 템플릿의 "신규 로직 테스트 누락 없음"이 이 문서를 가리킨다.

## 도구

- **jest-expo** preset(`jest.config.js`). 실행: `npm test`.
- 단위 테스트: `*.test.ts(x)`를 대상 파일 옆 또는 `__tests__/`에.
- 구조적 테스트: `__tests__/structural/` (패턴/드리프트 기계 검증).

## 무엇을 테스트하나 (4축)

신규 **로직**이 들어가면 테스트를 남긴다. 대상:

1. **`src/lib/`** — 순수 함수·파생 계산. PRD §4.3을 경계값으로 검증(0%/100%/마감/seatsLeft≤0).
   - 환급 점수·환급 나뭇잎·co2·이메일 정규식·돈 포맷·이모지 추측.
2. **`src/hooks/`** — 커스텀 훅의 반환 shape·상태 전이.
3. **`src/stores/`** — Zustand 스토어 액션의 상태 변화.
4. **검증 규칙** — 폼 validation(로그인/회원가입/join/eval)의 enable 조건.

UI 픽셀/스타일은 단위 테스트 대상이 아니다(디자인은 시각 검수·QA가 담당).

## 구조적 테스트 (`__tests__/structural/`)

코드 전체를 스캔해 컨벤션을 기계적으로 강제한다. `harness-feedback` Level 3 / `/gc`가 자동 생성.

- 예: 모든 Screen이 `SafeAreaView`를 쓰는지, 하드코딩 색이 없는지, `src/data/`를 직접 import하지 않는지.

## 기준

- 신규 `src/lib`·`src/hooks`·`src/stores` 로직은 테스트 동반(PR 체크리스트).
- 버그 수정 시 회귀 테스트 1개 추가.
- `npm test` 통과가 PR 머지 조건.
