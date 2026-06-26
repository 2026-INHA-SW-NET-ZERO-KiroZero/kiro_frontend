---
name: github-issue-create
description: GitHub 이슈를 생성하는 스킬. "이슈 만들어줘", "이슈 생성", "issue 만들어", "버그 리포트 만들어", "이슈화 해줘", "이걸 이슈로", "PRD를 이슈로 나눠줘" 처럼 이슈 생성을 요청하면 반드시 이 스킬을 사용. .github/ISSUE_TEMPLATE/의 기존 템플릿을 그대로 따라 생성한다. 배치 생성도 지원.
---

# github-issue-create — 이슈 생성

## 핵심 원칙

**`.github/ISSUE_TEMPLATE/`의 기존 템플릿을 반드시 따른다. 자체 포맷 금지.**
이유: 팀 전체의 이슈 일관성이 깨지면 추적·필터·자동화가 무너진다.

## 워크플로우

1. **템플릿 파악** — `.github/ISSUE_TEMPLATE/`를 읽어 사용 가능한 유형 확인:
   - `feature.md` / `bug.md` / `design.md` / `refactor.md` / `test.md` / `chore.md`
   - 각 템플릿의 frontmatter(labels, title prefix)와 본문 섹션을 확인한다.

2. **유형 선택** — 사용자 설명을 분석해 적절한 템플릿을 고른다.

3. **템플릿대로 작성 + 생성**

   ```bash
   gh issue create --title "[Feature] ..." --label "feature" --body "$(cat <<'EOF'
   ## 개요
   ...
   EOF
   )"
   ```
   - title prefix와 labels는 템플릿 frontmatter를 따른다.
   - 본문은 템플릿의 모든 섹션을 채운다(빈 섹션은 `- ` 유지).

4. **코드 분석 기반 생성 지원** — "이 컴포넌트 리팩토링 이슈 만들어줘" 같은 요청은 코드를 분석해 현재 문제·개선 방향을 채운다.

5. **배치 생성 지원** — PRD를 이슈로 나누는 등 여러 개를 만들 때는 **목록을 먼저 보여주고 사용자 확인 후** 실행한다.

## 참조

- `.github/ISSUE_TEMPLATE/` (유형별 템플릿)
- `docs/FRONTEND.md`, `docs/DESIGN.md`, `FRONTEND_PRD.md`

## 범위 밖

- `.github/` 템플릿 자체 수정. (템플릿 변경은 별도 chore 이슈로.)
- 백엔드 작업 이슈 생성(다른 팀원 담당)은 만들지 않는다.
