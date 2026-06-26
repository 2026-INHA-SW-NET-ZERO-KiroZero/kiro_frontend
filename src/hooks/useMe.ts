/** 현재 사용자 프로필 데이터 훅. (`GET /api/v1/auth/me` → `CurrentUserResponse`) */
import { useCallback } from 'react';

import { apiRequest } from '@/lib/apiClient';
import { formatWon } from '@/lib/format';
import { SKILL_TO_LABEL } from '@/types';
import type { CurrentUserResponse, Me } from '@/types';

import { useApiData } from './useApiData';
import type { AsyncResult } from './useApiData';

function toMe(res: CurrentUserResponse): Me {
  return {
    name: res.nickname,
    email: res.email,
    skill: SKILL_TO_LABEL[res.cookingSkill],
    allergy: res.allergyTags,
    leaves: formatWon(res.cash),
  };
}

export function useMe(): AsyncResult<Me | null> {
  const fetcher = useCallback(
    async (): Promise<Me | null> => toMe(await apiRequest<CurrentUserResponse>('/auth/me')),
    [],
  );
  return useApiData<Me | null>(fetcher, { initial: null, isEmpty: (d) => d === null });
}
