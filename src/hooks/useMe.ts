/** 현재 사용자 프로필 데이터 훅. (API 교체 지점: `GET /me`) */
import { me } from '@/data';
import type { DataResult, Me } from '@/types';

import { useSeedValue } from './useSeed';

export function useMe(): DataResult<Me> {
  return useSeedValue(me);
}
