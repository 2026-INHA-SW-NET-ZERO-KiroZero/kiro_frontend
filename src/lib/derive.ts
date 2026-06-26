/**
 * 지난 모임 평가 파생 계산 (PRD §4.3). 순수 함수 — 더미 단계에서 클라이언트가 계산하고,
 * 백엔드 연동 시 환급 점수/나뭇잎은 서버 응답으로 대체한다.
 *
 * 평가 완료 모임의 표시값은 `seedEval`(완성 음식 소비율 + 재료별 소진율)을 기준으로 한다.
 * 값 출처: KiroZero.dc.html computed(refundScore/refundCredit/usageRows).
 */
import type { PastMeeting } from '@/types';

/** 내가 가져온 재료 문자열 구분자 (예: '토마토 3개 · 양파 1개'). */
const BROUGHT_SEP = ' · ';

const LOW_CARBON_SCORE = 40; // 저탄소 메뉴 선택 고정 배점
const RESERVE_LEAVES = 2000; // 모임당 예약 나뭇잎

export function splitBrought(brought: string): string[] {
  return brought.split(BROUGHT_SEP).filter(Boolean);
}

/** 내가 가져온 재료명 목록 — 참여자 중 isMe의 brought를 분해. */
export function myBroughtNames(past: PastMeeting): string[] {
  const me = past.parts.find((p) => p.isMe);
  return me ? splitBrought(me.brought) : [];
}

/** 재료별 소진율 1행. */
export interface UsageRow {
  name: string;
  /** 소진율 % (0~100). */
  pct: number;
}

/** 탄소중립 환급 내역. */
export interface RefundBreakdown {
  /** 환급 점수 (40 + useScore + eatScore). */
  score: number;
  /** 저탄소 메뉴 선택 (고정 40). */
  lowScore: number;
  /** 재료 소진율 점수 (_/30). */
  useScore: number;
  /** 완성 음식 소비율 점수 (_/30). */
  eatScore: number;
  /** 환급 나뭇잎. */
  credit: number;
  /** 예약 나뭇잎 (2000). */
  reserve: number;
}

/** PRD §4.3 환급 점수/나뭇잎 — useAvg(평균 소진율), foodPct(소비율) 기준. */
export function refundBreakdown(useAvg: number, foodPct: number): RefundBreakdown {
  const useScore = Math.round((30 * useAvg) / 100);
  const eatScore = Math.round((30 * foodPct) / 100);
  const score = LOW_CARBON_SCORE + useScore + eatScore;
  const credit = Math.round((RESERVE_LEAVES * 0.5 * score) / 100);
  return { score, lowScore: LOW_CARBON_SCORE, useScore, eatScore, credit, reserve: RESERVE_LEAVES };
}

/** 평가 완료 모임의 표시 결과. */
export interface PastEvalResult {
  /** 완성 음식 소비율 %. */
  eatPct: number;
  /** 내가 가져온 재료별 소진율 행. */
  usageRows: UsageRow[];
  refund: RefundBreakdown;
}

/** seedEval 기준 평가 결과 파생(재료 누락 시 past.rate fallback). */
export function derivePastEval(past: PastMeeting): PastEvalResult {
  const usageRows: UsageRow[] = myBroughtNames(past).map((name) => ({
    name,
    pct: past.seedEval.use[name] ?? past.rate,
  }));
  const useVals = usageRows.map((r) => r.pct);
  const useAvg = useVals.length ? useVals.reduce((a, b) => a + b, 0) / useVals.length : past.rate;
  const eatPct = past.seedEval.food;
  return { eatPct, usageRows, refund: refundBreakdown(useAvg, eatPct) };
}
