#!/usr/bin/env bash
# PostToolUse Hook — 자동 교정 루프 (1차 방어)
# 에이전트가 .ts/.tsx 파일을 저장하면 eslint --fix(자동 수정) + tsc(타입 체크)를 실행한다.
# 에러가 있으면 exit 2로 stderr를 에이전트 컨텍스트에 주입 → 에이전트가 스스로 수정 → 재저장 → 반복.
set -uo pipefail

INPUT="$(cat)"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# stdin JSON에서 편집된 파일 경로 추출 (node로 안전하게 파싱)
FILE="$(printf '%s' "$INPUT" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.tool_input?.file_path||'')}catch(e){}})" 2>/dev/null)"

# .ts/.tsx 가 아니면 통과
case "$FILE" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

# theme.ts·docs·node_modules 등 lint 무관 경로는 건너뛴다(eslint가 ignore 처리하지만 빠른 종료)
cd "$PROJECT_DIR" || exit 0

ESLINT_OUT="$(npx --no-install eslint --fix "$FILE" 2>&1)"; ESLINT_CODE=$?
TSC_OUT="$(npx --no-install tsc --noEmit 2>&1)"; TSC_CODE=$?

if [ "$ESLINT_CODE" -ne 0 ] || [ "$TSC_CODE" -ne 0 ]; then
  {
    echo "⛔ [자동 검사 실패] $FILE — 아래 에러를 직접 수정한 뒤 다시 저장하세요."
    if [ "$ESLINT_CODE" -ne 0 ]; then
      echo "── ESLint ──"
      echo "$ESLINT_OUT"
    fi
    if [ "$TSC_CODE" -ne 0 ]; then
      echo "── TypeScript ──"
      echo "$TSC_OUT"
    fi
  } >&2
  exit 2
fi

exit 0
