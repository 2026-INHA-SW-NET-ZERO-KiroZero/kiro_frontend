# API-INTEGRATION.md — 백엔드 API 연동 워크플로우

> 이 문서의 역할: 더미데이터를 실제 백엔드 API로 교체할 때 **반드시 지켜야 하는 절차**.
> 핵심 원칙: **추측으로 연동하지 않는다.** 코드를 쓰기 전에 백엔드 Swagger와 저장된 명세서가 일치하는지 먼저 확인한다.

## 언제 적용하나

`src/hooks/`·`src/features/*/hooks/`의 커스텀 훅 내부(더미데이터 반환부)를 실제 API 호출로 바꾸는 모든 작업.
백엔드 Swagger 주소가 확보된 뒤에만 시작한다.

### 백엔드 Swagger 주소

- 서버 주소: https://umc-lxd.shop/ (앱은 `.env.local`의 `EXPO_PUBLIC_API_BASE_URL`로 주입)
- Swagger UI: https://umc-lxd.shop/swagger-ui/index.html
- OpenAPI JSON: https://umc-lxd.shop/v3/api-docs
- 상태(2026-06-27 확인): **엔드포인트 22개 정의됨**(title `KiroZero Backend API` v1.0.0). 이전 "paths 비어 있음" 상태에서 채워졌다. 스냅샷은 `docs/references/backend-swagger.json`, 추출 명세는 `docs/generated/api-schema.md`에 정리. **이제 연동 가능 — 단, 도메인별로 아래 절차(Swagger ↔ api-schema 대조 → 일치 시에만 구현)를 지킨다. 미연동 도메인은 더미데이터 유지.**

## 필수 절차 (순서 고정)

### 1. 백엔드 Swagger 먼저 확인

- 전달받은 Swagger UI 주소 또는 `swagger.json`(OpenAPI) 스펙을 연다.
- 연동 대상 엔드포인트의 **method · path · 요청 body · 응답 shape · 상태코드**를 읽는다.

### 2. 저장된 명세서와 대조

- `docs/generated/api-schema.md`(우리가 저장한 API 명세)와 Swagger를 **항목별로 비교**한다.
- 비교 포인트: 경로, 메서드, 요청/응답 필드 이름·타입·필수여부, 페이징/에러 형식.

### 3. 일치 여부 판정 → 분기

- **완전 일치** → 4단계로 진행.
- **불일치** → **코드 작성 금지.** 원인을 구분해 처리한다:
  - 우리 명세(`api-schema.md`)가 옛 버전 → 명세서를 Swagger 기준으로 갱신하고, 변경점을 기록.
  - 백엔드가 합의된 명세와 다름(필드 누락·이름 변경 등) → **백엔드 팀에 알리고**(필요 시 bug/chore 이슈 생성) 합의 전까지 보류.
- 어느 쪽이든 **임의 추측으로 필드를 만들어 진행하지 않는다.**

### 4. 일치 확인 후에만 구현

- 훅 **내부만** 교체한다(예: `useRooms()`가 시드 대신 `GET /rooms` 호출). UI와 타입 shape은 그대로 유지(PRD §5).
- 응답 타입은 `src/types/`의 기존 타입과 맞춘다. 다르면 타입을 먼저 조정하고 영향 범위를 확인.
- 로딩/에러/빈 상태를 훅이 반환하도록 한다.
- 더미 시드(`src/data/`)는 연동 완료된 도메인부터 제거한다.

### 5. Swagger 스냅샷 보관 + 명세서 동기화

- 받은 Swagger 스펙을 `docs/references/backend-swagger.json`(또는 `-llms.txt`)으로 저장해 버전을 남긴다.
- `docs/generated/api-schema.md`를 그 스냅샷 기준으로 갱신한다.

## QA 체크 (kiro-qa)

- API 연동 PR은 "Swagger ↔ api-schema.md ↔ 훅 응답 타입 ↔ UI 소비 필드"가 **4중으로 일치**하는지 경계면 교차 검증한다.
- 불일치를 추측으로 메운 흔적(임의 옵셔널 처리, `any`, 캐스팅)이 있으면 반려한다.

> 관련: `docs/FRONTEND.md` §6(데이터 페칭), `docs/generated/api-schema.md`, `.claude/agents/kiro-logic.md`.
