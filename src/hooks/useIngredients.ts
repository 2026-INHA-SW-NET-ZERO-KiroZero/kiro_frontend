/** 통합 식재료 데이터 훅. (API 교체 지점: 방 확정 후 통합 식재료 계산값) */
import { aggIngredients } from '@/data';
import type { AggIngredient, DataResult } from '@/types';

import { useSeedList } from './useSeed';

export function useAggIngredients(): DataResult<AggIngredient[]> {
  return useSeedList(aggIngredients);
}
