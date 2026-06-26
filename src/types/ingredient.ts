/** 재료 마스터 타입 (사용자가 재료 등록 시 검색/선택하는 종류). */

/** 재료 마스터 1건. 아이콘(이모지) 미사용 — 텍스트(`nameKo`)로만 노출. */
export interface Ingredient {
  /** 마스터 PK. */
  id: number;
  /** 한글 재료명 (예: '계란'). */
  nameKo: string;
  /** 개수 → 그램 환산값. */
  gramsPerCount: number;
}

/** API `GET /api/v1/ingredients` 단건 응답. */
export interface IngredientItemResponse {
  ingredientId: number;
  nameKo: string;
  gramsPerCount: number;
}

/** API `GET /api/v1/ingredients` 목록 응답. */
export interface IngredientSearchResponse {
  ingredients: IngredientItemResponse[];
}
