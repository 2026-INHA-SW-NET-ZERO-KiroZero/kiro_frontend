/** 인증·알레르기 도메인 DTO (백엔드 Swagger auth-controller · allergy-tag-controller 1:1). */

/** 서버 요리 숙련도 enum. */
export type CookingSkill = 'HIGH' | 'MEDIUM' | 'LOW';

/** 화면 표시용 한국어 숙련도 — `src/types/user.ts`의 `SkillLevel`과 사실상 같은 값(theme skillChip 키와 일치). */
export type SkillLabel = '상' | '중' | '하';

export const SKILL_TO_SERVER: Record<SkillLabel, CookingSkill> = {
  상: 'HIGH',
  중: 'MEDIUM',
  하: 'LOW',
};

export const SKILL_TO_LABEL: Record<CookingSkill, SkillLabel> = {
  HIGH: '상',
  MEDIUM: '중',
  LOW: '하',
};

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  cookingSkill: CookingSkill;
  allergyTags: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  email: string;
  nickname: string;
  cookingSkill: CookingSkill;
  /** 누적 환불 적립금(원). */
  cash: number;
  allergyTags: string[];
  token: string;
}

export interface CurrentUserResponse {
  userId: number;
  email: string;
  nickname: string;
  cookingSkill: CookingSkill;
  /** 누적 환불 적립금(원). 프론트에서는 "나뭇잎"으로 표기. */
  cash: number;
  allergyTags: string[];
}

/** 프로필 수정 요청 (`PUT /api/v1/me/profile`). */
export interface UpdateProfileRequest {
  nickname: string;
  cookingSkill: CookingSkill;
  allergyTags: string[];
}

export interface AllergyTagItemResponse {
  tag: string;
  labelKo: string;
  description: string;
}

export interface AllergyTagListResponse {
  allergyTags: AllergyTagItemResponse[];
}
