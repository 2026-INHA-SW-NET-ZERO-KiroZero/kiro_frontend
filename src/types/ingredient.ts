/**
 * 재료 마스터 타입 (사용자가 재료 등록 시 검색/선택하는 100종).
 * 출처: 001_ingredient_master_seed.sql / ingredient_master 테이블.
 */

/** 알레르겐 태그 (SQL `allergen_tags_json` 값). */
export type AllergenTag =
  | 'egg'
  | 'milk'
  | 'soy'
  | 'wheat'
  | 'fish'
  | 'sesame'
  | 'peanut'
  | 'tree_nut'
  | 'mollusk_shellfish';

/** 재료 마스터 1건. 아이콘(이모지) 미사용 — 텍스트(`nameKo`)로만 노출. */
export interface Ingredient {
  /** 마스터 PK. */
  id: number;
  /** 한글 재료명 (예: '계란'). */
  nameKo: string;
  /** 개수 → 그램 환산값. */
  gramsPerCount: number;
  /** 알레르겐 태그 목록 (없으면 빈 배열). */
  allergenTags: AllergenTag[];
  /** 탄소계수 (kgCO2e per kg). */
  carbonFactor: number;
}
