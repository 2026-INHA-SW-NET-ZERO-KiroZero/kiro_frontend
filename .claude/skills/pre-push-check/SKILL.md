---
name: pre-push-check
description: 원격에 push하기 직전에 실행하는 점검 스킬. "push 해줘", "이거 푸시해도 돼?", "푸시 전에 확인", "pre-push 점검", "푸시 전 docs 동기화 확인" 같은 말이나 .githooks/pre-push가 Claude 점검을 안내할 때 트리거. push될 모든 커밋의 코드 변경이 docs/(특히 component-inventory·api-schema·DESIGN·FRONTEND)와 동기화돼 있는지 점검하고, 누락 시 문서 수정안을 제안한다. 코드는 절대 자동 수정하지 않는다. (테스트는 이 스킬 범위에서 제외 — 사용자 요청)
---

# Pre-Push Check — push 직전 docs 동기화 점검

`git push` 직전에 실행한다. **push될 모든 커밋**(`origin/<현재브랜치>..HEAD`)을 보고 **docs가 코드와 동기화돼 있는지** 점검한다.

pre-commit/PostToolUse Hook은 가벼운 lint·typecheck를 담당한다. 이 단계는 push가 더 드물고 깨진 문서를 올리는 비용이 크므로, 더 느려도 되는 "느린 차선"이다.

> **테스트는 점검하지 않는다(사용자 요청).** `.githooks/pre-push`가 이미 `npm run harness`(lint+typecheck+format)를 돌린다. 이 스킬은 **docs 동기화 한 가지에 집중**한다.

## 1. 언제 실행하나

- 사용자가 "push 해줘" / "이거 푸시해도 돼?" 라고 하면 → `git push` **전에** 실행.
- `.githooks/pre-push`가 트리거되어 Claude 점검을 안내할 때.
- "푸시 전에 한 번 더 봐줘" 같은 명시 요청.

push할 게 없으면(`git log origin/<현재브랜치>..HEAD` 가 비어 있으면) 즉시 종료한다.

## 2. 점검: docs ↔ 코드 동기화

**왜 중요한가:** 이 레포는 `docs/`에 제품/설계/디자인 문서를 둔다. 코드가 "문서화된 동작"을 바꿨는데 문서를 안 고치면 문서가 조용히 썩는다.

### 절차

1. push될 커밋의 diff를 본다:
   ```bash
   git diff origin/$(git branch --show-current)..HEAD
   ```
2. **외부로 드러나는(문서화된) 동작**에 영향을 주는 코드 변경을 식별한다:
   - 라우트/화면 추가·변경·삭제 (`src/app/`, `src/features/`)
   - 공용 컴포넌트 추가·변경·삭제 (`src/components/`) 또는 props 시그니처 변경
   - 디자인 토큰 변경 (`src/theme/theme.ts` — 색/타이포/간격/그림자)
   - API 호출 추가·변경 (백엔드 연동 시: 엔드포인트, 요청/응답 DTO)
   - 컨벤션·폴더 구조·상태관리 패턴 변경
3. 각 변경이 **같은 push 안에서** 대응 문서에 반영됐는지 확인한다:
   | 코드 변경 | 동기화 대상 문서 |
   |---|---|
   | 화면/라우트/컴포넌트 추가·변경 | `docs/generated/component-inventory.md` (+ `FRONTEND_PRD.md §3` 대조) |
   | 디자인 토큰 변경 | `docs/DESIGN.md` |
   | API 표면 변경 | `docs/generated/api-schema.md` (`docs/API-INTEGRATION.md` 절차 준수) |
   | 컨벤션/폴더/상태 패턴 변경 | `docs/FRONTEND.md` |
4. 불일치마다:
   - 어떤 코드 변경(파일+라인)이 어떤 문서 섹션을 낡게 만들었는지 짚는다.
   - **구체적인 문서 수정안**(추가/변경할 정확한 라인)을 제안한다.
   - **사용자 확인 후에만** 문서를 수정한다.
5. 이미 같은 push에서 문서가 갱신됐으면 명시하고 넘어간다.

**판단 규칙:** **외부로 드러나는 동작**을 바꾼 변경만 플래그한다. 내부 리팩토링(private 함수 이름 변경, 서비스 분리)은 문서 갱신이 불필요하다. 디자인은 "완성 디자인과 픽셀 동일"이 기준이므로, 토큰을 임의로 바꿨다면 그 자체가 의심 신호 — DESIGN.md 반영 여부와 함께 디자인 일탈이 아닌지 확인한다.

## 3. 출력 형식

동기화 OK:

```
✅ pre-push 점검 통과
  - docs: 동기화됨 (문서화 대상 변경 없음, 또는 이미 이 push에 반영됨)
```

불일치:

```
⚠️ docs 동기화 누락
  - 코드: RoomCard 컴포넌트 추가 (src/components/RoomCard.tsx:1)
  - 문서: docs/generated/component-inventory.md 에 해당 항목 없음
  - 제안 수정 (적용할까요? y/N):
        | RoomCard | src/components/RoomCard.tsx | 공용 | 5 | home, meetings |
```

## 4. 하지 말 것

- **시크릿/커밋 메시지 점검 금지** — pre-commit 단계에서 이미 처리.
- **테스트 실행/점검 금지** — 사용자 요청으로 이 스킬에서 제외(필요하면 `npm test`를 별도로).
- **코드 자동 수정 금지** — 코드 수정은 사용자/담당 에이전트의 몫.
- **문서 무단 수정 금지** — 항상 수정안을 보여주고 확인을 기다린다.
- **범위 침범 금지** — 이번 push와 무관한 문서는 건드리지 않는다.

## 5. 한 줄 요약

**pre-commit은 빠른 차선, pre-push는 느린 차선 — 테스트는 빼고, docs가 코드와 실제로 맞는지 본다.**
