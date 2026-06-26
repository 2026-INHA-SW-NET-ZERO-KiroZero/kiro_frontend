/** 익명 참여자 프로필 풀 데이터 훅. (API 교체 지점: 방 상세 참여자 정보) */
import { partyPool } from '@/data';
import type { DataResult, PartyProfile } from '@/types';

import { useSeedList } from './useSeed';

export function usePartyPool(): DataResult<PartyProfile[]> {
  return useSeedList(partyPool);
}
