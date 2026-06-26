import { useCallback } from 'react';

import { searchIngredients } from '@/lib/ingredientApi';
import type { Ingredient, IngredientSearchResponse } from '@/types';

import { useApiData, type AsyncResult } from './useApiData';

function toIngredient(item: IngredientSearchResponse['ingredients'][number]): Ingredient {
  return { id: item.ingredientId, nameKo: item.nameKo, gramsPerCount: item.gramsPerCount };
}

/** 재료 검색 훅. keyword가 빈 문자열이면 즉시 빈 배열 반환. */
export function useIngredients(keyword: string): AsyncResult<Ingredient[]> {
  const fetcher = useCallback((): Promise<Ingredient[]> => {
    const trimmed = keyword.trim();
    if (!trimmed) return Promise.resolve([]);
    return searchIngredients(trimmed).then((res) => res.ingredients.map(toIngredient));
  }, [keyword]);

  return useApiData(fetcher, {
    initial: [],
    isEmpty: (data) => data.length === 0,
  });
}
