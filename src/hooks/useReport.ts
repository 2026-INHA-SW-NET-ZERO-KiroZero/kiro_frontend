/**
 * 월별 절감 리포트 데이터 + 월 네비게이션 훅. (PRD §3.12)
 *
 * 데이터는 `useSeedList(reportMonths)` 경유(UI는 `src/data/` 직접 import 금지).
 * 선택 월(`monthIndex`)은 화면-로컬 상태로 이 훅이 캡슐화한다. 기본값은 마지막(현재) 월.
 *
 * API 교체 지점: 월별 리포트 엔드포인트가 생기면 `reportMonths` 시드만 fetch로 바꾼다.
 */
import { useCallback, useMemo, useState } from 'react';

import { reportMonths } from '@/data';
import type { ReportMonth } from '@/types';

import { useSeedList } from './useSeed';

/** 바차트 막대 1개 — 색은 UI가 `isCurrent`로 토큰 결정(데이터에 색 미포함). */
export interface ReportBar {
  short: string;
  /** 막대 높이(%) 0~100. */
  h: number;
  /** 현재 선택된 월 여부(강조 색 적용). */
  isCurrent: boolean;
}

/** 선택 월의 표시용 값 — 절감량은 소수 1자리 문자열. */
export interface ReportView {
  joined: number;
  provided: number;
  used: number;
  rate: number;
  saved: string;
  people: number;
}

export interface UseReportResult {
  /** 선택 월 집계 표시값. */
  report: ReportView;
  /** 월별 바차트 데이터(5개월). */
  bars: ReportBar[];
  /** 탄소 절감 환산값(kg, 소수 1자리 문자열) = saved × 2.5. */
  co2: string;
  /** 월 라벨(예: '2026년 6월'). */
  monthLabel: string;
  /** 현재(마지막) 월 절감량(kg, 소수 1자리 문자열) — MY 화면 카드용. */
  currentSaved: string;
  canPrev: boolean;
  canNext: boolean;
  prevMonth: () => void;
  nextMonth: () => void;
}

export function useReport(): UseReportResult {
  const { data: months } = useSeedList<ReportMonth>(reportMonths);
  const lastIndex = months.length - 1;
  const [monthIndex, setMonthIndex] = useState(lastIndex);

  const prevMonth = useCallback(() => {
    setMonthIndex((i) => Math.max(0, i - 1));
  }, []);
  const nextMonth = useCallback(() => {
    setMonthIndex((i) => Math.min(lastIndex, i + 1));
  }, [lastIndex]);

  return useMemo(() => {
    const sel = months[monthIndex];
    return {
      report: {
        joined: sel.joined,
        provided: sel.provided,
        used: sel.used,
        rate: sel.rate,
        saved: sel.saved.toFixed(1),
        people: sel.people,
      },
      bars: months.map((m, i) => ({ short: m.short, h: m.h, isCurrent: i === monthIndex })),
      co2: (sel.saved * 2.5).toFixed(1),
      monthLabel: sel.label,
      currentSaved: months[lastIndex].saved.toFixed(1),
      canPrev: monthIndex > 0,
      canNext: monthIndex < lastIndex,
      prevMonth,
      nextMonth,
    };
  }, [months, monthIndex, lastIndex, prevMonth, nextMonth]);
}
