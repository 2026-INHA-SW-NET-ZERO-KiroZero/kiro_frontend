/**
 * 표기(format) 순수 함수 모음 (PRD §3.7 · §7).
 * 계산값(환급/탄소 등)은 백엔드에서 받아오고, 여기서는 표기만 담당한다.
 */

/** 돈 표기 — `value.toLocaleString('ko-KR') + '원'` (PRD §3.7). */
export function formatWon(value: number): string {
  return value.toLocaleString('ko-KR') + '원';
}

const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'] as const;

/**
 * ISO date("2026-06-26")를 로컬 자정 Date로 파싱한다.
 * `new Date("2026-06-26")`는 UTC 자정으로 해석돼 타임존에 따라 날짜가 밀릴 수 있어 직접 파싱한다.
 */
export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** ISO date → "MM.DD (요일)" (예: "2026-06-26" → "06.26 (금)"). */
export function formatDateLabel(iso: string): string {
  const date = parseIsoDate(iso);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}.${dd} (${WEEKDAYS_KO[date.getDay()]})`;
}
