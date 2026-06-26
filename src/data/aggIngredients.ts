/**
 * 더미데이터 시드 — 통합 식재료 8종 (4명의 재료 통합 결과).
 * (PRD §3.4 · §3.6 · §5, 값 출처: KiroZero.dc.html `this.aggIngredients`)
 *
 * TODO(API): 방 확정 후 통합 식재료는 백엔드 계산값으로 교체. `useAggIngredients()` 경유.
 */
import type { AggIngredient } from '@/types';

export const aggIngredients: AggIngredient[] = [
  { emoji: '🥚', name: '계란', qty: '12개', from: '' },
  { emoji: '🌭', name: '소시지', qty: '8개', from: '' },
  { emoji: '🥬', name: '김치', qty: '400g', from: '' },
  { emoji: '🧅', name: '양파', qty: '2개', from: '' },
  { emoji: '🧄', name: '대파', qty: '4대', from: '' },
  { emoji: '🍲', name: '두부', qty: '1.5모', from: '' },
  { emoji: '🥩', name: '돼지고기', qty: '300g', from: '' },
  { emoji: '🥛', name: '우유', qty: '500ml', from: '' },
];
