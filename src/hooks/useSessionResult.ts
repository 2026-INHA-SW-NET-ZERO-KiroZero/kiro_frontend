/** 세션 탄소 절감 리포트 훅. `GET /api/v1/sessions/{slotId}/result` */
import { useCallback } from 'react';

import { getSessionResult } from '@/lib/sessionApi';
import type { SessionResultResponse } from '@/types';

import { useApiData, type AsyncResult } from './useApiData';

export function useSessionResult(slotId: number): AsyncResult<SessionResultResponse | null> {
  const fetcher = useCallback(() => getSessionResult(slotId), [slotId]);
  return useApiData<SessionResultResponse | null>(fetcher, {
    initial: null,
    isEmpty: (d) => d === null,
  });
}
