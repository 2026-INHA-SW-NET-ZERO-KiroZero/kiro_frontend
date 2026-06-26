/** 정산 데이터 훅. (API 교체 지점: 백엔드 정산 계산값) */
import { settlementData } from '@/data';
import type { DataResult, Settlement } from '@/types';

import { useSeedValue } from './useSeed';

/**
 * 정산 단건 조회. 현재 더미는 방과 무관한 단일 시드라 `id`를 무시한다.
 * 백엔드 연동 시 `GET /rooms/:id/settlement`로 교체한다.
 */
export function useSettlement(_id: string): DataResult<Settlement> {
  return useSeedValue(settlementData);
}
