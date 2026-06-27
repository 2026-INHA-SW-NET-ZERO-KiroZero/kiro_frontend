/** 통합 식재료 데이터 훅. GET /api/v1/sessions/{slotId} → sharedIngredientPool 매핑. */
import { useCallback } from 'react';

import { getSession } from '@/lib/sessionApi';
import type { AggIngredient } from '@/types';
import type { SharedIngredientPoolItemResponse } from '@/types/session';

import { useApiData, type AsyncResult } from './useApiData';

function toAggIngredient(item: SharedIngredientPoolItemResponse): AggIngredient {
  const qty =
    item.totalEstimatedGrams != null ? `${item.totalEstimatedGrams}g` : `${item.totalCount}개`;
  return { emoji: '', name: item.nameKo, qty, from: '' };
}

export function useAggIngredients(slotId: number): AsyncResult<AggIngredient[]> {
  const fetcher = useCallback(
    () => getSession(slotId).then((res) => res.sharedIngredientPool.map(toAggIngredient)),
    [slotId],
  );
  return useApiData(fetcher, { initial: [], isEmpty: (d) => d.length === 0 });
}
