/** 지난 모임/평가 관련 공유 타입 (PRD §3.10 · §3.11 · §5). */

/** 지난 모임에서 함께 만든 메뉴 요약. */
export interface PastMenu {
  emoji: string;
  name: string;
  time: string;
  servings: string;
}

/** 평가 시드 — 완성 음식 소비율(food) + 내가 가져온 재료별 소진율(use). */
export interface SeedEval {
  /** 완성 음식 소비율 % (0~100). */
  food: number;
  /** 재료명 → 소진율 % (0~100). */
  use: Record<string, number>;
}

/** 지난 모임 참여자 행. */
export interface PastPart {
  label: string;
  isMe?: boolean;
  /** 아바타 식별 색 (theme `avatarPalette`의 값). */
  color: string;
  skill: string;
  /** 가져온 재료 표기 (예: '토마토 3개 · 양파 1개'). */
  brought: string;
}

/** 지난 모임 (meetings 지난 모임 · pastApplication · pastEval). `past2`는 평가 완료 상태. */
export interface PastMeeting {
  id: string;
  emoji: string;
  title: string;
  /** 날짜+시각 표기 (예: '06.18 (목) 19:00'). */
  date: string;
  place: string;
  /** 참여 인원 표기 (예: '4/4명'). */
  members: string;
  state: string;
  /** 절감량 표기 (예: '0.9kg'). */
  saved: string;
  menu: PastMenu;
  /** 버려질 뻔한 음식물 (예: '0.9kg'). */
  foodKg: string;
  /** 탄소 배출 감축 (예: '2.3kg'). */
  co2: string;
  /** 재료 소진율 % (도넛 링). */
  rate: number;
  /** 자동차 환산 거리 (예: '9.6km'). */
  km: string;
  /** 끼니 환산 (예: '1.4끼'). */
  meals: string;
  seedEval: SeedEval;
  parts: PastPart[];
}
