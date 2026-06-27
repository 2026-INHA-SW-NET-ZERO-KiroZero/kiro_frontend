/**
 * 지난 모임 평가 파생 계산 (PRD §4.3). 순수 함수 — 더미 단계에서 클라이언트가 계산하고,
 * 백엔드 연동 시 환급 점수/나뭇잎은 서버 응답으로 대체한다.
 *
 * 평가 완료 모임의 표시값은 `seedEval`(완성 음식 소비율 + 재료별 소진율)을 기준으로 한다.
 * 값 출처: KiroZero.dc.html computed(refundScore/refundCredit/usageRows).
 */
import { color } from '@/theme/theme';
import { SKILL_TO_LABEL } from '@/types';
import type {
  MyApplication,
  MySessionDetailResponse,
  MySessionItemResponse,
  PastMeeting,
  PastPart,
  SessionResultResponse,
} from '@/types';

import { formatDateLabel, parseIsoDate } from './format';

/** 내가 가져온 재료 문자열 구분자 (예: '토마토 3개 · 양파 1개'). */
const BROUGHT_SEP = ' · ';

const LOW_CARBON_SCORE = 40; // 저탄소 메뉴 선택 고정 배점
const RESERVE_LEAVES = 2000; // 모임당 예약 나뭇잎

/** 참여자 아바타 식별색 순서 (dc.html `appPalette`). */
const AVATAR_PALETTE = [color.purple, color.brand, color.eco, color.goldSoft];
/** 탄소 1kg ≈ 자동차 주행 거리(km) 환산 계수. */
const CARBON_KM_PER_KG = 4.17;
/** 한 끼 분량(g) 환산 기준. */
const GRAMS_PER_MEAL = 650;
/** 목록 단계에서 알 수 없는(결과 API 필요) 값의 placeholder. */
const UNKNOWN = '—';
/** 메뉴/모임 기본 이모지. */
const DEFAULT_EMOJI = '🍽';

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

/* ----------------------------------------------------------------------------
 * 내 모임(세션) API → 화면 shape 매핑 (issue #33)
 * `GET /me/sessions` 항목과 `GET /me/sessions/{id}` + `GET /sessions/{id}/result`를
 * 화면이 쓰는 MyApplication·PastMeeting shape으로 변환한다.
 * -------------------------------------------------------------------------- */

/** ISO date 기준 D-day 라벨 — 오늘 이후는 'D-n', 과거는 '마감'. */
export function ddayLabel(iso: string): string {
  const target = parseIsoDate(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  return diffDays >= 0 ? `D-${diffDays}` : '마감';
}

/** 내 모임 목록 항목 → 신청 내역 카드(다가오는 모임). */
export function mySessionItemToApplication(item: MySessionItemResponse): MyApplication {
  return {
    id: String(item.slotId),
    title: item.selectedMenu?.menuName ?? item.placeName,
    place: item.placeName,
    stationCode: item.stationCode,
    date: formatDateLabel(item.date),
    time: item.startTime,
    capacity: item.capacity,
    count: Number(item.participantCount),
    dday: ddayLabel(item.date),
  };
}

/**
 * 내 모임 목록 항목 → 지난 모임 카드(부분).
 * 절감량·재료 소진율 등 결과값은 `GET /sessions/{id}/result` 없이는 알 수 없어 placeholder로 둔다.
 */
export function mySessionItemToPastMeetingPartial(item: MySessionItemResponse): PastMeeting {
  const name = item.selectedMenu?.menuName ?? item.placeName;
  return {
    id: String(item.slotId),
    emoji: DEFAULT_EMOJI,
    title: name,
    date: `${formatDateLabel(item.date)} ${item.startTime}`,
    place: item.placeName,
    stationCode: item.stationCode,
    members: `${Number(item.participantCount)}/${item.capacity}명`,
    state: '조리 완료',
    saved: UNKNOWN,
    menu: { emoji: DEFAULT_EMOJI, name, time: '-', servings: '4인분' },
    foodKg: UNKNOWN,
    co2: UNKNOWN,
    rate: 0,
    km: UNKNOWN,
    meals: UNKNOWN,
    seedEval: { food: 0, use: {} },
    parts: [],
  };
}

/**
 * 모임 상세 + 결과 → 지난 모임 전체 shape.
 * 날짜/장소는 두 응답 어디에도 없어 placeholder로 둔다(목록 캐시 도입 시 개선).
 */
export function mySessionDetailAndResultToPastMeeting(
  detail: MySessionDetailResponse,
  result: SessionResultResponse,
  myParticipantId: number,
): PastMeeting {
  const participants = detail.session.participants;
  const parts: PastPart[] = participants.map((p, i) => {
    const isMe = p.participantId === myParticipantId;
    const names = isMe
      ? detail.myIngredients.map((ing) => ing.nameKo)
      : p.ingredients.map((ing) => ing.nameKo);
    return {
      label: isMe ? '나' : p.nickname,
      isMe,
      color: AVATAR_PALETTE[i % AVATAR_PALETTE.length],
      skill: SKILL_TO_LABEL[p.cookingSkill],
      brought: names.join(BROUGHT_SEP),
    };
  });

  const total = participants.length;
  const foodKg = `${(result.estimatedFoodWasteReducedGrams / 1000).toFixed(1)}kg`;

  return {
    id: String(detail.slotId),
    emoji: DEFAULT_EMOJI,
    title: result.menuName,
    date: UNKNOWN,
    place: UNKNOWN,
    members: `${total}/${total}명`,
    state: '조리 완료',
    saved: foodKg,
    menu: { emoji: DEFAULT_EMOJI, name: result.menuName, time: '-', servings: '4인분' },
    foodKg,
    co2: `${result.estimatedCarbonSavedKgco2e.toFixed(1)}kg`,
    rate: result.avgIngredientUseRate,
    km: `${(result.estimatedCarbonSavedKgco2e * CARBON_KM_PER_KG).toFixed(1)}km`,
    meals: `${(result.estimatedFoodWasteReducedGrams / GRAMS_PER_MEAL).toFixed(1)}끼`,
    seedEval: { food: result.finishedFoodRate, use: {} },
    parts,
  };
}
