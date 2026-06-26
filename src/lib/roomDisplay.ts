/**
 * 방 상태 → 배지/좌석/CTA 분기 (PRD §3.4, §7 "한 함수로 통일").
 * 색·라벨은 theme.ts `statusChip` 토큰에서 조회하고, 여기서는 분기 로직만 담당한다.
 */
import type { statusChip } from '@/theme/theme';

/** 방 진행 상태 (PRD §3.4 state-branched). */
export type RoomState = 'OPEN' | 'CONFIRMED' | 'COOKED';

/** 배지 키 — theme.ts `statusChip`과 동기화. */
export type StatusBadgeKey = keyof typeof statusChip;

/** CTA가 유발하는 동작 (화면 라우팅용). disabled면 null. */
export type RoomCtaAction = 'join' | 'cancel' | 'recommend' | 'usage' | 'settlement' | null;

export interface RoomCta {
  /** 버튼 라벨 (PRD §3.4 원문 카피). */
  label: string;
  action: RoomCtaAction;
  disabled: boolean;
  /** 채움 버튼(primary) vs 회색 버튼(grey). */
  variant: 'primary' | 'grey';
}

export interface RoomDisplay {
  /** 남은 좌석 수 (capacity - count, 0 미만은 0으로 클램프). */
  seatsLeft: number;
  /** 모임 정보 "N/4명". */
  seatsCount: string;
  /** Sticky footer "마감까지 {seatsText}"의 seatsText. */
  seatsText: string;
  /** 상태 배지 키 (statusChip 조회용). */
  badge: StatusBadgeKey;
  cta: RoomCta;
}

export interface RoomDisplayInput {
  state: RoomState;
  capacity: number;
  count: number;
  /** 현재 사용자가 참여 중인지 (OPEN CTA 분기). */
  joined?: boolean;
  /** 메뉴가 정해졌는지 (CONFIRMED CTA 분기). */
  hasMenu?: boolean;
  /** 인원 미달로 모집 취소됐는지. */
  canceled?: boolean;
}

/** 상태 배지 키 결정 (PRD §3.4). */
function resolveBadge(state: RoomState, seatsLeft: number, canceled: boolean): StatusBadgeKey {
  if (canceled) return 'canceled';
  if (state === 'COOKED') return 'cooked';
  if (state === 'CONFIRMED') return 'confirmed';
  // OPEN — 디자인 원본(KiroZero.dc.html)엔 '모집중' 배지가 없고 'N자리 남음'(seatsLeft)만 존재.
  if (seatsLeft <= 0) return 'full';
  if (seatsLeft <= 1) return 'almostFull';
  return 'seatsLeft';
}

/** CTA 결정 (PRD §3.4 "CTA logic (critical)"). */
function resolveCta(input: RoomDisplayInput, seatsLeft: number): RoomCta {
  const { state, joined = false, hasMenu = false } = input;
  if (state === 'COOKED') {
    return { label: '정산 확인하기', action: 'settlement', disabled: false, variant: 'primary' };
  }
  if (state === 'CONFIRMED') {
    return hasMenu
      ? { label: '조리 완료 기록하기', action: 'usage', disabled: false, variant: 'primary' }
      : { label: 'AI 메뉴 추천 받기', action: 'recommend', disabled: false, variant: 'primary' };
  }
  // OPEN
  if (joined) {
    return { label: '신청 취소', action: 'cancel', disabled: false, variant: 'grey' };
  }
  if (seatsLeft <= 0) {
    return { label: '마감', action: null, disabled: true, variant: 'grey' };
  }
  return { label: '이 모임 참여하기', action: 'join', disabled: false, variant: 'primary' };
}

/** 방 상태/정원으로 배지·좌석·CTA 표시값을 한 번에 계산. */
export function roomDisplay(input: RoomDisplayInput): RoomDisplay {
  const { state, capacity, count, canceled = false } = input;
  const seatsLeft = Math.max(0, capacity - count);
  const badge = resolveBadge(state, seatsLeft, canceled);
  return {
    seatsLeft,
    seatsCount: `${count}/${capacity}명`,
    seatsText: seatsLeft > 0 ? `${seatsLeft}자리 남음` : '마감',
    badge,
    cta: resolveCta(input, seatsLeft),
  };
}
