/**
 * 2026년 6월 캘린더 그리드 빌더 (PRD §3.8 · dc.html `buildCalendar`).
 * 정적 레이아웃 계산이라 더미데이터(`src/data/`)가 아닌 순수 함수로 둔다.
 * 오늘=26(빨강 원), 모임일 마커는 호출 측이 실제 모임 날짜 집합을 전달한다.
 */
import { color } from '@/theme/theme';

export type CalendarCell = {
  /** 셀에 표시할 일(날짜) 숫자. */
  label: number;
  /** 날짜 숫자 색. */
  numColor: string;
  /** 오늘(원 채움) 여부 — 원 배경은 brand. */
  isToday: boolean;
  /** 모임일 마커 이모지('🍚') 또는 빈 문자열. */
  marker: string;
};

const TODAY = 26;

type RawCell = { d: number; muted: boolean };

function numColor(muted: boolean, col: number): string {
  if (muted) return color.iconFaint;
  if (col === 0) return color.brandAlt; // 일요일
  if (col === 6) return color.blue; // 토요일
  return color.listInk; // 평일
}

/**
 * 6월 그리드를 주(week) 단위 7칸 배열로 반환. (5주 × 7칸)
 * @param meetingDays 실제 모임이 있는 날(day) 숫자 집합.
 */
export function buildCalendarWeeks(meetingDays: Set<number>): CalendarCell[][] {
  const cells: RawCell[] = [{ d: 31, muted: true }]; // 5/31 (일)
  for (let d = 1; d <= 30; d++) cells.push({ d, muted: false });
  for (let d = 1; d <= 4; d++) cells.push({ d, muted: true }); // 7/1~7/4

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7).map((c, col) => {
      const isToday = !c.muted && c.d === TODAY;
      return {
        label: c.d,
        numColor: isToday ? color.white : numColor(c.muted, col),
        isToday,
        marker: !c.muted && meetingDays.has(c.d) ? '🍚' : '',
      };
    });
    weeks.push(week);
  }
  return weeks;
}

/** 요일 헤더 — 일(빨강)·토(파랑)·평일(회색). */
export const WEEKDAYS: { label: string; color: string }[] = [
  { label: '일', color: color.brandAlt },
  { label: '월', color: color.textMute },
  { label: '화', color: color.textMute },
  { label: '수', color: color.textMute },
  { label: '목', color: color.textMute },
  { label: '금', color: color.textMute },
  { label: '토', color: color.blue },
];
