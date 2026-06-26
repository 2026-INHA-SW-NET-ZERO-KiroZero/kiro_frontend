/** 알레르기 토글 칩 옵션 데이터 훅. (API 교체 지점: 알레르기 마스터 목록) */
import { allergyAll } from '@/data';
import type { AllergyOption, DataResult } from '@/types';

import { useSeedList } from './useSeed';

export function useAllergyOptions(): DataResult<AllergyOption[]> {
  return useSeedList(allergyAll);
}
