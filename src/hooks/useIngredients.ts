/** 재료 마스터 데이터 훅 — 사용자가 재료 등록 시 검색/선택하는 100종. */
import { ingredients } from '@/data';
import type { Ingredient, DataResult } from '@/types';

import { useSeedList } from './useSeed';

export function useIngredients(): DataResult<Ingredient[]> {
  return useSeedList(ingredients);
}
