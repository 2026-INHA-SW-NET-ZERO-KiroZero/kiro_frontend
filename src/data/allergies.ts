/**
 * 더미데이터 시드 — 알레르기 토글 칩 옵션 10종.
 * (PRD §5, 값 출처: KiroZero.dc.html `this.allergyAll`)
 *
 * TODO(API): 알레르기 마스터 목록은 백엔드 상수/엔드포인트로 교체 가능. `useAllergyOptions()` 경유.
 */
import type { AllergyOption } from '@/types';

export const allergyAll: AllergyOption[] = [
  { label: '땅콩', emoji: '🥜' },
  { label: '갑각류', emoji: '🦐' },
  { label: '우유', emoji: '🥛' },
  { label: '계란', emoji: '🥚' },
  { label: '밀', emoji: '🌾' },
  { label: '대두', emoji: '🫘' },
  { label: '견과류', emoji: '🌰' },
  { label: '생선', emoji: '🐟' },
  { label: '복숭아', emoji: '🍑' },
  { label: '돼지고기', emoji: '🥩' },
];
