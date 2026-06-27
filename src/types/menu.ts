/** 메뉴 추천·투표·확정 관련 공유 타입 (PRD §5). */

/** 필요/추가구매 재료 항목 (name + qty). */
export interface IngredientNeed {
  n: string;
  q: string;
}

/** 공동 구매 품목. */
export interface Purchase {
  item: string;
  buyer: string;
  cost: string;
}

/** AI 추천 메뉴 후보 (recommend 화면). */
export interface MenuCandidate {
  name: string;
  /** API 미제공 — optional. */
  emoji?: string;
  /** API 미제공 — optional. 화면은 rank 인덱스로 표시. */
  score?: number;
  time: string;
  /** 난이도 (예: '쉬움' | '아주 쉬움' | '보통'). */
  diff: string;
  desc: string;
  needed: IngredientNeed[];
  /** 추가 구매 필요 재료 (없으면 빈 배열). */
  missing: IngredientNeed[];
  /** 저탄소 메뉴 여부. */
  type: '저탄소' | '일반';
  /** API 미제공 — optional. */
  co2?: string;
  /** API candidateLabel (투표 제출 시 사용). */
  candidateLabel?: string;
}

/** 투표 후보 메뉴 (myApplication 투표 단계). E(재추천)는 인덱스 4의 합성 옵션. */
export interface VoteMenu {
  key: string;
  name: string;
  /** API 미제공 — optional. */
  emoji?: string;
  type: '저탄소' | '일반';
  desc: string;
  votes: number;
  /** API 미제공 — optional. */
  co2?: string;
  purchase: Purchase | null;
  /** API candidateLabel (투표 제출 시 사용). */
  candidateLabel?: string;
}

/** 역할 분배 & 준비물 (확정 메뉴의 인별 카드). */
export interface MenuRole {
  who: string;
  role: string;
  /** 가져올/추가구매 재료 (없으면 '없음'). */
  bring: string;
  isMe: boolean;
  steps: string[];
}

/** 투표로 결정된 메뉴 (myApplication result 단계). */
export interface DecidedMenu {
  name: string;
  emoji: string;
  type: '저탄소' | '일반';
  time: string;
  servings: string;
  co2: string;
  /** 득표 표기 (예: '4표 중 2표'). */
  votes: string;
  purchase: Purchase | null;
  recipe: string[];
  roles: MenuRole[];
}
