/** 세션 현황 참여자 목록 훅. GET /api/v1/sessions/{slotId} → participants 매핑. */
import { useCallback } from 'react';

import { getSession } from '@/lib/sessionApi';
import type { PartyProfile } from '@/types';
import type { SessionParticipantStatusResponse } from '@/types/session';

import { useApiData, type AsyncResult } from './useApiData';

function mapSkill(s: 'HIGH' | 'MEDIUM' | 'LOW'): string {
  if (s === 'HIGH') return '상';
  if (s === 'MEDIUM') return '중';
  return '하';
}

function toPartyProfile(p: SessionParticipantStatusResponse): PartyProfile {
  return {
    skill: mapSkill(p.cookingSkill),
    allergies: p.allergyTags,
    bring: p.ingredients.map((ing) => ({ e: '', n: `${ing.nameKo} ${ing.count}개` })),
    extra: p.canPurchase,
  };
}

export function usePartyPool(slotId: number): AsyncResult<PartyProfile[]> {
  const fetcher = useCallback(
    () => getSession(slotId).then((res) => res.participants.map(toPartyProfile)),
    [slotId],
  );
  return useApiData(fetcher, { initial: [], isEmpty: (d) => d.length === 0 });
}
