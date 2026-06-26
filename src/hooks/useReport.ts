/**
 * 월별 절감 리포트 데이터 + 월 네비게이션 훅. (PRD §3.12)
 *
 * 데이터는 `useResultTotal()`(`GET /me/results/total`)의 `monthlyResults`를 소비한다.
 * 백엔드가 2026년 2~6월을 내림차순으로 보내므로 yearMonth 오름차순으로 정렬해 차트(좌→우)에 쓴다.
 * 선택 월(`monthIndex`)은 화면-로컬 상태로 캡슐화하며 기본값은 마지막(현재) 월이다.
 *
 * 매핑(MonthlyResultSummaryResponse → 화면): saved(음식물 절감 kg)←totalUsedGrams/1000,
 * co2(탄소 kg)←totalEstimatedCarbonSavedKgco2e, rate(소진율)←averageIngredientUseRate,
 * joined←completedSessionCount, people←togetherPeopleCount, provided←providedIngredientCount,
 * used←usedIngredientCount.
 */
import { useCallback, useMemo, useState } from 'react';

import type { MonthlyResultSummaryResponse } from '@/types';

import { useResultTotal } from './useResultTotal';

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
  /** 월별 바차트 데이터. */
  bars: ReportBar[];
  /** 선택 월 탄소 절감 환산값(kg, 소수 1자리 문자열). */
  co2: string;
  /** 월 라벨(예: '2026년 6월'). */
  monthLabel: string;
  /** 현재(마지막) 월 절감량(kg, 소수 1자리 문자열) — MY 화면 카드용. */
  currentSaved: string;
  canPrev: boolean;
  canNext: boolean;
  prevMonth: () => void;
  nextMonth: () => void;
  loading: boolean;
  error: Error | null;
  isEmpty: boolean;
}

/** 바차트 최대 높이(%) — 디자인 헤드룸 확보를 위해 가장 큰 달을 88%로 스케일. */
const BAR_MAX_PERCENT = 88;

const EMPTY_REPORT: ReportView = {
  joined: 0,
  provided: 0,
  used: 0,
  rate: 0,
  saved: '0.0',
  people: 0,
};

interface ReportMonthView {
  label: string;
  short: string;
  savedKg: number;
  co2Kg: number;
  rate: number;
  joined: number;
  people: number;
  provided: number;
  used: number;
}

/** "2026-06" → "2026년 6월". */
function fullMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return `${year}년 ${Number(month)}월`;
}

function toMonthView(m: MonthlyResultSummaryResponse): ReportMonthView {
  return {
    label: fullMonthLabel(m.yearMonth),
    short: m.monthLabel,
    savedKg: m.totalUsedGrams / 1000,
    co2Kg: m.totalEstimatedCarbonSavedKgco2e,
    rate: m.averageIngredientUseRate,
    joined: m.completedSessionCount,
    people: m.togetherPeopleCount,
    provided: m.providedIngredientCount,
    used: m.usedIngredientCount,
  };
}

export function useReport(): UseReportResult {
  const { data: total, loading, error, isEmpty } = useResultTotal();

  const months = useMemo<ReportMonthView[]>(() => {
    if (total === null) return [];
    return [...total.monthlyResults]
      .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth))
      .map(toMonthView);
  }, [total]);

  const lastIndex = months.length - 1;
  // 사용자가 월을 고르기 전엔 picked=null → 마지막(현재) 월을 기본 선택. effect 불필요.
  const [picked, setPicked] = useState<number | null>(null);
  const index = picked === null ? lastIndex : Math.min(picked, lastIndex);

  const prevMonth = useCallback(() => {
    setPicked(Math.max(0, index - 1));
  }, [index]);
  const nextMonth = useCallback(() => {
    setPicked(Math.min(lastIndex, index + 1));
  }, [index, lastIndex]);

  return useMemo(() => {
    if (months.length === 0) {
      return {
        report: EMPTY_REPORT,
        bars: [],
        co2: '0.0',
        monthLabel: '',
        currentSaved: '0.0',
        canPrev: false,
        canNext: false,
        prevMonth,
        nextMonth,
        loading,
        error,
        isEmpty,
      };
    }

    const sel = months[index];
    const maxSaved = Math.max(...months.map((m) => m.savedKg));

    return {
      report: {
        joined: sel.joined,
        provided: sel.provided,
        used: sel.used,
        rate: sel.rate,
        saved: sel.savedKg.toFixed(1),
        people: sel.people,
      },
      bars: months.map((m, i) => ({
        short: m.short,
        h: maxSaved > 0 ? Math.round((m.savedKg / maxSaved) * BAR_MAX_PERCENT) : 0,
        isCurrent: i === index,
      })),
      co2: sel.co2Kg.toFixed(1),
      monthLabel: sel.label,
      currentSaved: months[lastIndex].savedKg.toFixed(1),
      canPrev: index > 0,
      canNext: index < lastIndex,
      prevMonth,
      nextMonth,
      loading,
      error,
      isEmpty,
    };
  }, [months, index, lastIndex, prevMonth, nextMonth, loading, error, isEmpty]);
}
