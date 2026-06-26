# /health — 하네스 건강 점검 워크플로우

하네스 자체가 건강한지(문서·린트·Hook이 따로 놀지 않는지) 점검한다.

1. **docs/generated/ 동기화 확인** — `component-inventory.md` vs 실제 파일, `api-schema.md` vs 실제 호출.
2. **docs/ 문서 유효성 확인** — 문서가 참조하는 경로·패턴이 실제와 일치하는지.
3. **docs/FRONTEND.md 규칙 vs eslint.config.js 규칙 일치 확인**
   - 문서에만 있고 린트 없는 규칙 → Level 2 승격 제안
   - 린트 교정 지시가 불충분한 규칙 → Level 2.5 업데이트 제안
4. **Hook 설정 정상 동작 확인** — `.claude/settings.json`의 PostToolUse Hook이 실제로 도는지.
5. **QUALITY_SCORE.md 갱신**
6. **피드백 로그 요약** — `docs/design-docs/feedback-log.md`의 최근 변경 요약.
