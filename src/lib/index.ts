/**
 * 순수 유틸(lib) barrel (PRD §4.3 · §7).
 * 환급/탄소 등 계산값은 백엔드에서 받아오고, 여기서는 검증·표기·표시 분기만 담당한다.
 */
export {
  INHA_EMAIL_DOMAIN,
  checkInhaEmail,
  isLoginValid,
  isSignupEmailValid,
  isIngredientRowValid,
  isVoteValid,
} from './validators';
export type { EmailValidity, EmailFeedback } from './validators';
export { formatWon } from './format';
export { roomDisplay } from './roomDisplay';
export { tokenStorage } from './tokenStorage';
export type {
  RoomState,
  StatusBadgeKey,
  RoomCtaAction,
  RoomCta,
  RoomDisplay,
  RoomDisplayInput,
} from './roomDisplay';
