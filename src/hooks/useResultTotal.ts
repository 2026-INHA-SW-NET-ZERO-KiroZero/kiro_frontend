/** 내 누적 리포트 데이터 훅. (`GET /api/v1/me/results/total` → `MyResultTotalResponse`) */
import { useCallback } from 'react';

import { apiRequest } from '@/lib/apiClient';
import type { MyResultTotalResponse } from '@/types';

import { useApiData } from './useApiData';
import type { AsyncResult } from './useApiData';

export function useResultTotal(): AsyncResult<MyResultTotalResponse | null> {
  const fetcher = useCallback(
    (): Promise<MyResultTotalResponse> => apiRequest<MyResultTotalResponse>('/me/results/total'),
    [],
  );
  return useApiData<MyResultTotalResponse | null>(fetcher, {
    initial: null,
    isEmpty: (d) => d === null || d.monthlyResults.length === 0,
  });
}
