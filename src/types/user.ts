/** 사용자/프로필 관련 공유 타입 (PRD §4.1 · §5). */

/** 요리 숙련도 (segmented control 상/중/하). */
export type SkillLevel = '상' | '중' | '하';

/**
 * 현재 사용자 프로필 (백엔드 `CurrentUserResponse` 매핑).
 * `name←nickname`, `skill←cookingSkill`, `allergy←allergyTags`(tag 문자열), `leaves←cash`(누적 환불 적립금, 프론트 표기 "나뭇잎").
 */
export interface Me {
  nickname: string;
  email: string;
  /** 요리 숙련도 (상/중/하). */
  skill: SkillLevel;
  /** 알레르기 tag 문자열 목록 (예: ['peanut','crustacean_shellfish']). */
  allergy: string[];
  /** "나뭇잎" 표기 — 누적 적립금(원) 문자열 (예: '2,400원'). */
  leaves: string;
}

/** 알레르기 토글 칩 옵션 (백엔드 `AllergyTagItemResponse` 매핑). tag로 식별, label은 한국어 표기. */
export interface AllergyOption {
  /** 서버 식별자 (예: 'peanut'). 선택 토글·저장(allergyTags)에 사용. */
  tag: string;
  /** 한국어 표기 (labelKo, 예: '땅콩'). */
  label: string;
}
