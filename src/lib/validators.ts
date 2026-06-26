/**
 * 폼 검증 순수 함수 모음 (PRD §1 signup · §7 Validation rules).
 * 한국어 카피는 PRD 원문 그대로 사용한다(임의로 다시 쓰지 않음).
 */

/** 인하대 이메일 도메인 (PRD §3.2 · §7). */
export const INHA_EMAIL_DOMAIN = /@(inha\.ac\.kr|inha\.edu)$/i;

/** 이메일 검증 상태. */
export type EmailValidity = 'empty' | 'incomplete' | 'valid' | 'invalidDomain';

export interface EmailFeedback {
  validity: EmailValidity;
  /** 인라인 안내 카피 (PRD §3.2). 중립 상태(empty·incomplete)면 null. */
  message: string | null;
}

/**
 * 인하 이메일 라이브 검증 (PRD §3.2).
 * - valid → "인하대 이메일이 확인됐어요"
 * - `@` 있으나 도메인 불일치 → "@inha.ac.kr 또는 @inha.edu 만 가입할 수 있어요"
 * - 빈 입력 / `@` 입력 전 → 중립(메시지 없음).
 */
export function checkInhaEmail(email: string): EmailFeedback {
  const value = email.trim();
  if (value === '') return { validity: 'empty', message: null };
  if (INHA_EMAIL_DOMAIN.test(value)) {
    return { validity: 'valid', message: '인하대 이메일이 확인됐어요' };
  }
  if (value.includes('@')) {
    return { validity: 'invalidDomain', message: '@inha.ac.kr 또는 @inha.edu 만 가입할 수 있어요' };
  }
  return { validity: 'incomplete', message: null };
}

/** Login: email non-empty (PRD §7). */
export function isLoginValid(email: string): boolean {
  return email.trim() !== '';
}

/** Signup: 인하 도메인 일치 (PRD §7). */
export function isSignupEmailValid(email: string): boolean {
  return checkInhaEmail(email).validity === 'valid';
}

/** Join: 재료 행은 재료명 + 개수 필수, grams는 선택 (PRD §7). */
export function isIngredientRowValid(nameKo: string, count: string): boolean {
  return nameKo.trim() !== '' && count.trim() !== '';
}

/** Vote: 선택 필수, E(재추천)는 사유 필수 (PRD §7). */
export function isVoteValid(selectedKey: string | null, reason: string): boolean {
  if (!selectedKey) return false;
  if (selectedKey === 'E') return reason.trim() !== '';
  return true;
}
