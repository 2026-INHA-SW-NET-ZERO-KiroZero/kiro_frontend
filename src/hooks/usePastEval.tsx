/**
 * 지난 모임 평가 완료 상태 공유 컨텍스트. (PRD §3.10·§3.11)
 *
 * pastApplication 화면이 평가 여부를 읽고, pastEval 화면이 제출 시 기록한다.
 * 제출은 `POST /api/v1/sessions/{slotId}/consumption-records`로 보내고,
 * 성공 시 해당 slotId를 평가 완료로 표시한다(앱 세션 내 메모리 — 새로고침 시 서버가 truth).
 *
 * TODO(API): 평가 여부 초기값을 목록(`GET /me/sessions`)의 필드로 채우면 새로고침 후에도 유지된다.
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { pastEvaluatedSeed } from '@/data';
import { apiRequest } from '@/lib/apiClient';
import type { CreateConsumptionRecordRequest, CreateConsumptionRecordResponse } from '@/types';

interface PastEvalState {
  /** 평가 완료된 모임 id 집합. */
  evaluated: Record<string, boolean>;
  /** 해당 모임이 평가 완료됐는지. */
  isEvaluated: (id: string) => boolean;
  /** 모임 평가를 제출(사용량 기록 생성)한다. */
  markEvaluated: (
    slotId: number,
    payload: CreateConsumptionRecordRequest,
  ) => Promise<CreateConsumptionRecordResponse>;
  /** 제출 진행 중. */
  submitting: boolean;
  /** 마지막 제출 실패 메시지. */
  submitError: string | null;
}

export const PastEvalContext = createContext<PastEvalState>({
  evaluated: {},
  isEvaluated: () => false,
  markEvaluated: () => Promise.reject(new Error('PastEvalProvider가 필요합니다.')),
  submitting: false,
  submitError: null,
});

export function usePastEvalProvider(): PastEvalState {
  const [evaluated, setEvaluated] = useState<Record<string, boolean>>(() => ({
    ...pastEvaluatedSeed,
  }));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEvaluated = useCallback((id: string) => !!evaluated[id], [evaluated]);

  const markEvaluated = useCallback(
    async (
      slotId: number,
      payload: CreateConsumptionRecordRequest,
    ): Promise<CreateConsumptionRecordResponse> => {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await apiRequest<CreateConsumptionRecordResponse>(
          `/sessions/${slotId}/consumption-records`,
          { method: 'POST', body: payload },
        );
        setEvaluated((prev) => ({ ...prev, [String(slotId)]: true }));
        return res;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : '평가 제출에 실패했어요.';
        setSubmitError(msg);
        throw e instanceof Error ? e : new Error(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return useMemo(
    () => ({ evaluated, isEvaluated, markEvaluated, submitting, submitError }),
    [evaluated, isEvaluated, markEvaluated, submitting, submitError],
  );
}

export function usePastEval(): PastEvalState {
  return useContext(PastEvalContext);
}
