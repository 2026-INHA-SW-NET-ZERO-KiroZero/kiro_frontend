/**
 * 더미데이터 시드 — 정산 (영수증 항목 + 분담). 금액은 원 단위 number.
 * (PRD §3.7 · §5, 값 출처: KiroZero.dc.html `this.settlementData`)
 *
 * TODO(API): 정산은 백엔드 계산값으로 교체. `useSettlement(id)` 경유(현재 단건 시드).
 */
import type { Settlement } from '@/types';

export const settlementData: Settlement = {
  payer: '차태훈',
  items: [
    { n: '베이컨 100g', a: 4500 },
    { n: '밥 4공기', a: 3000 },
    { n: '라면사리 2개', a: 2500 },
  ],
  total: 10000,
  per: 2500,
  debtors: [
    { n: '이주한', a: 2500 },
    { n: '김준호', a: 2500 },
    { n: '임준현', a: 2500 },
  ],
};
