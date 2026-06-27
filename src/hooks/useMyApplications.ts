/** 내 신청 내역(다가오는 모임) 데이터 훅. (`GET /api/v1/me/sessions`) */
import { useCallback } from 'react';

import { apiRequest } from '@/lib/apiClient';
import { mySessionItemToApplication } from '@/lib/derive';
import type { DataResult, MyApplication, MySessionListResponse } from '@/types';

import { useApiData } from './useApiData';

/** 다가오는 모임 목록 — COMPLETED(지난 모임)는 제외한다. */
export function useMyApplications(): DataResult<MyApplication[]> {
  const fetcher = useCallback(async (): Promise<MyApplication[]> => {
    const res = await apiRequest<MySessionListResponse>('/me/sessions');
    return res.sessions.filter((s) => s.status !== 'COMPLETED').map(mySessionItemToApplication);
  }, []);

  return useApiData<MyApplication[]>(fetcher, {
    initial: [],
    isEmpty: (d) => d.length === 0,
  });
}

/** 신청 내역 단건 — id로 조회. 목록 응답에서 찾으며, 없으면 `data:null, isEmpty:true`. */
export function useMyApplication(id: string): DataResult<MyApplication | null> {
  const { data, loading, error } = useMyApplications();
  const item = data.find((a) => a.id === id) ?? null;
  return { data: item, loading, error, isEmpty: !loading && item === null };
}
