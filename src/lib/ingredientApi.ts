/**
 * 재료 마스터 검색 API (api-schema.md ingredient-controller §).
 * 훅 내부에서만 호출한다 — UI는 훅으로 접근.
 */
import { apiRequest } from '@/lib/apiClient';
import type { IngredientSearchResponse } from '@/types/ingredient';

/** 재료 검색. `GET /api/v1/ingredients?keyword={keyword}` */
export function searchIngredients(keyword: string): Promise<IngredientSearchResponse> {
  const params = new URLSearchParams({ keyword });
  return apiRequest<IngredientSearchResponse>(`/ingredients?${params.toString()}`);
}
