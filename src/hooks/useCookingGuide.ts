/** 단계별 조리 가이드 훅. `GET /api/v1/sessions/{slotId}/cooking-guide` */
import { useCallback } from 'react';

import { getCookingGuide } from '@/lib/sessionApi';
import type { CookingGuideResponse } from '@/types';

import { useApiData, type AsyncResult } from './useApiData';

export function useCookingGuide(
  slotId: number,
  enabled = true,
  view: 'all' | 'mine' = 'all',
): AsyncResult<CookingGuideResponse | null> {
  const fetcher = useCallback(
    () => (enabled ? getCookingGuide(slotId, view) : Promise.resolve(null)),
    [slotId, enabled, view],
  );
  return useApiData<CookingGuideResponse | null>(fetcher, {
    initial: null,
    isEmpty: (d) => d === null || d.steps.length === 0,
  });
}
