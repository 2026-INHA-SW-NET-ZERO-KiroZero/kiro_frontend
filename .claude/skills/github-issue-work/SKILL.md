---
name: github-issue-work
description: GitHub 이슈를 기반으로 작업을 수행하는 스킬. "issue #3", "이슈 #3", "#3 작업", "#3 해줘", "깃허브 이슈 작업", "이 이슈 진행" 처럼 이슈 번호나 깃허브 이슈 작업을 언급하면 반드시 이 스킬을 사용. 이슈를 조회해 작업 계획을 세우고, 적절한 에이전트/스킬로 연계하며, 시작·완료 코멘트를 남긴다.
---

# github-issue-work — 이슈 기반 작업

KiroZero의 모든 작업은 GitHub 이슈를 기반으로 진행된다. 이 스킬은 이슈 하나를 받아 작업으로 풀어낸다.

## 워크플로우

1. **이슈 조회**

   ```bash
   gh issue view {번호} --json title,body,labels,assignees,milestone
   ```

2. **작업 유형 판단** — 라벨/본문으로 feature / bug / design / refactor / test / chore 구분.
   - **백엔드 라벨 이슈는 거부한다**(다른 팀원 담당). 사용자에게 알리고 중단.

3. **작업 계획 생성** — `docs/exec-plans/{YYYY-MM-DD}-issue-{번호}.md`:
   - 원본 이슈 URL, Labels, Milestone
   - 목표 (이슈 본문에서 추출)
   - 관련 파일 (코드 분석으로 파악)
   - 작업 분해 (체크리스트)
   - 완료 기준 (이슈의 완료 기준 복사)

4. **에이전트/스킬 연계** — 유형에 맞게:
   - feature/design → `kiro-build`(팀으로 화면/기능 구현)
   - bug/refactor → 해당 영역 에이전트(kiro-ui/kiro-logic) + kiro-qa
   - test → 구조적 테스트는 `__tests__/structural/`

5. **시작 코멘트**

   ```bash
   gh issue comment {번호} --body "🚀 작업 시작"
   ```

6. **완료 코멘트** — 변경 파일 목록 + 요약을 코멘트로 남긴다.

7. **이슈 close 안 함** — PR 머지 시 자동 close된다(PR 본문 `closes #번호`).

## 참조

- `.github/ISSUE_TEMPLATE/`, `.github/pull_request_template.md`
- `docs/FRONTEND.md`, `docs/DESIGN.md`, `docs/exec-plans/`

## 범위 밖

- 백엔드 라벨 이슈는 거부한다.
- 이슈 close(PR 머지가 담당).
