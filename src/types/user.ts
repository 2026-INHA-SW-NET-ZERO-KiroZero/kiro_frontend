/** 사용자/프로필 관련 공유 타입 (PRD §4.1 · §5). */

/** 요리 숙련도 (segmented control 상/중/하). */
export type SkillLevel = '상' | '중' | '하';

/** 현재 사용자 프로필. */
export interface Me {
  name: string;
  dept: string;
  email: string;
  /** 알레르기 라벨 목록 (예: ['땅콩','갑각류']). */
  allergy: string[];
  /** 등급 표기 (예: '새싹 쉐프'). */
  grade: string;
  /** 등급 레벨. */
  gradeLv: number;
  /** 보유 크레딧 표기 (예: '2,400원'). */
  cash: string;
  /** 누적 나뭇잎 보상 표기 (예: '240원'). */
  leaves: string;
}

/** 알레르기 토글 칩 옵션. */
export interface AllergyOption {
  label: string;
  emoji: string;
}
