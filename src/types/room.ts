/** 방(모임)·통합 식재료 관련 공유 타입 (PRD §5). */

/** 방 카드/상세의 참여자 요약 (호스트 이름 + 아바타 색). */
export interface RoomParticipant {
  /** 참여자(호스트) 이름. */
  n: string;
  /** 아바타 식별 색 (theme `avatarPalette`의 값). */
  c: string;
}

/** 오늘 열린 방 / 추천 모임 카드. `r1`은 방 상태가 heroStatus를 따르는 "hero" 방. */
export interface Room {
  id: string;
  title: string;
  /** 표기용 날짜 (예: '06.26 (금)'). */
  date: string;
  /** 시작 시각 (예: '16:00' | '18:00'). */
  time: string;
  place: string;
  /** 태그 목록 (예: ['저녁','조리실습실']). */
  tags: string[];
  capacity: number;
  /** 기본 참여 인원 수. */
  baseCount: number;
  host: string;
  parts: RoomParticipant[];
  /** 카드 미리보기 재료 이모지. */
  prev: string[];
  /** 현재 사용자가 이미 참여 중인지 여부 (API SlotDetailResponse.joined 매핑). */
  joined?: boolean;
}

/** 통합 식재료 행 (방 상세 통합 식재료 · 사용량 기록). */
export interface AggIngredient {
  emoji: string;
  name: string;
  /** 수량 표기 (예: '12개', '400g', '1.5모'). */
  qty: string;
  /** 제공자 표기 (현재 더미는 빈 문자열). */
  from: string;
}

/** 익명화된 참여자 프로필 (방/신청 참여자 카드 렌더용). */
export interface PartyBring {
  /** 재료 이모지. */
  e: string;
  /** 재료명 + 수량 (예: '계란 5개'). */
  n: string;
}

export interface PartyProfile {
  skill: string;
  /** 알레르기 표기 목록 (이모지 + 라벨, 예: '🥜 땅콩'). */
  allergies: string[];
  bring: PartyBring[];
  /** 추가 재료 구매 가능 여부. */
  extra: boolean;
}
