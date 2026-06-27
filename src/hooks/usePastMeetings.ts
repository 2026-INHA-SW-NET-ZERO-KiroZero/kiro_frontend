/**
 * 지난 모임 데이터 훅.
 * 목록: `GET /api/v1/me/sessions`(COMPLETED 필터).
 * 단건: `GET /api/v1/me/sessions/{id}` + `GET /api/v1/sessions/{id}/result` 병렬 호출.
 */
import { useCallback } from 'react';

import { apiRequest } from '@/lib/apiClient';
import {
  mySessionDetailAndResultToPastMeeting,
  mySessionItemToPastMeetingPartial,
} from '@/lib/derive';
import type {
  DataResult,
  MySessionDetailResponse,
  MySessionListResponse,
  PastMeeting,
  SessionIngredientResponse,
  SessionResultResponse,
} from '@/types';

import { useApiData } from './useApiData';

/** 단건 결과 + 평가 제출에 필요한 내 재료(`sessionIngredientId` 조달용). */
export interface PastMeetingResult extends DataResult<PastMeeting | null> {
  myIngredients: SessionIngredientResponse[];
}

/** 지난 모임 목록 — 결과값(절감량 등)은 placeholder, 단건 진입 시 채워진다. */
export function usePastMeetings(): DataResult<PastMeeting[]> {
  const fetcher = useCallback(async (): Promise<PastMeeting[]> => {
    const res = await apiRequest<MySessionListResponse>('/me/sessions');
    return res.sessions
      .filter((s) => s.status === 'COMPLETED')
      .map(mySessionItemToPastMeetingPartial);
  }, []);

  return useApiData<PastMeeting[]>(fetcher, {
    initial: [],
    isEmpty: (d) => d.length === 0,
  });
}

interface PastMeetingBundle {
  past: PastMeeting;
  myIngredients: SessionIngredientResponse[];
}

/** 지난 모임 단건 — 상세+결과를 합쳐 PastMeeting + 내 재료를 노출한다. */
export function usePastMeeting(id: string): PastMeetingResult {
  const fetcher = useCallback(async (): Promise<PastMeetingBundle> => {
    const [detail, result] = await Promise.all([
      apiRequest<MySessionDetailResponse>(`/me/sessions/${id}`),
      apiRequest<SessionResultResponse>(`/sessions/${id}/result`),
    ]);
    return {
      past: mySessionDetailAndResultToPastMeeting(detail, result, detail.myParticipantId),
      myIngredients: detail.myIngredients,
    };
  }, [id]);

  const { data, loading, error, isEmpty } = useApiData<PastMeetingBundle | null>(fetcher, {
    initial: null,
    isEmpty: (d) => d === null,
  });

  return {
    data: data?.past ?? null,
    loading,
    error,
    isEmpty,
    myIngredients: data?.myIngredients ?? [],
  };
}
