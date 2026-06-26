/**
 * 표기(format) 순수 함수 모음 (PRD §3.7 · §7).
 * 계산값(환급/탄소 등)은 백엔드에서 받아오고, 여기서는 표기만 담당한다.
 */

/** 돈 표기 — `value.toLocaleString('ko-KR') + '원'` (PRD §3.7). */
export function formatWon(value: number): string {
  return value.toLocaleString('ko-KR') + '원';
}
