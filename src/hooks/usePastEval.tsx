/**
 * 지난 모임 평가 완료 상태 공유 컨텍스트. (PRD §3.10·§3.11·§4.1 `pastEvaluated`)
 *
 * pastApplication 화면이 평가 여부를 읽고, pastEval 화면이 제출 시 기록하는 전역 상태라
 * Context로 공유한다(`ProfileContext`와 동일 패턴). 내비게이션을 넘어 유지된다.
 *
 * 초기값 출처: KiroZero.dc.html state(`pastEvaluated:{past2:true}`).
 *
 * TODO(API): 백엔드 연동 시 평가 제출은 `POST /me/past-meetings/{id}/eval`로 보내고,
 * 평가 여부는 `GET /me/past-meetings` 응답 필드로 대체한다.
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { pastEvaluatedSeed } from '@/data';

interface PastEvalState {
  /** 평가 완료된 모임 id 집합. */
  evaluated: Record<string, boolean>;
  /** 해당 모임이 평가 완료됐는지. */
  isEvaluated: (id: string) => boolean;
  /** 모임을 평가 완료로 기록(제출). */
  markEvaluated: (id: string) => void;
}

export const PastEvalContext = createContext<PastEvalState>({
  evaluated: {},
  isEvaluated: () => false,
  markEvaluated: () => {},
});

export function usePastEvalProvider(): PastEvalState {
  const [evaluated, setEvaluated] = useState<Record<string, boolean>>(() => ({
    ...pastEvaluatedSeed,
  }));

  const isEvaluated = useCallback((id: string) => !!evaluated[id], [evaluated]);

  const markEvaluated = useCallback((id: string) => {
    setEvaluated((prev) => ({ ...prev, [id]: true }));
  }, []);

  return useMemo(
    () => ({ evaluated, isEvaluated, markEvaluated }),
    [evaluated, isEvaluated, markEvaluated],
  );
}

export function usePastEval(): PastEvalState {
  return useContext(PastEvalContext);
}
