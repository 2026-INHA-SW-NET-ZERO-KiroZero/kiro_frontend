/** 알레르기 토글 칩 옵션 데이터 훅. (`GET /api/v1/allergy-tags` → `AllergyTagListResponse`) */
import { useCallback } from 'react';

import { apiRequest } from '@/lib/apiClient';
import type { AllergyOption, AllergyTagListResponse } from '@/types';

import { useApiData } from './useApiData';
import type { AsyncResult } from './useApiData';

export function useAllergyOptions(): AsyncResult<AllergyOption[]> {
  const fetcher = useCallback(async (): Promise<AllergyOption[]> => {
    const res = await apiRequest<AllergyTagListResponse>('/allergy-tags');
    return res.allergyTags.map((t) => ({ tag: t.tag, label: t.labelKo }));
  }, []);
  return useApiData<AllergyOption[]>(fetcher, { initial: [], isEmpty: (d) => d.length === 0 });
}
