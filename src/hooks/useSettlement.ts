/** 정산 체크리스트 훅. `GET /api/v1/sessions/{slotId}/checklist` */
import { useCallback } from 'react';

import { getSessionChecklist } from '@/lib/sessionApi';
import type { SessionChecklistResponse } from '@/types';

import { useApiData, type AsyncResult } from './useApiData';

export function useSettlement(slotId: number): AsyncResult<SessionChecklistResponse | null> {
  const fetcher = useCallback(() => getSessionChecklist(slotId), [slotId]);
  return useApiData<SessionChecklistResponse | null>(fetcher, {
    initial: null,
    isEmpty: (d) => d === null,
  });
}
