/** 정산 관련 공유 타입 (PRD §3.7 · §5). 금액은 원 단위 number. */

/** 영수증 항목 (이름 + 금액). */
export interface SettleItem {
  n: string;
  a: number;
}

/** 송금 대상자 (이름 + 분담 금액). */
export interface Debtor {
  n: string;
  a: number;
}

export interface Settlement {
  payer: string;
  items: SettleItem[];
  total: number;
  /** 1인당 분담액. */
  per: number;
  debtors: Debtor[];
}
