/** 지난 모임 데이터 훅. (API 교체 지점: `GET /me/past-meetings`) */
import { pastMeetings } from '@/data';
import type { DataResult, PastMeeting } from '@/types';

import { useSeedFind, useSeedList } from './useSeed';

/** 지난 모임 목록. */
export function usePastMeetings(): DataResult<PastMeeting[]> {
  return useSeedList(pastMeetings);
}

/** 지난 모임 단건 — id로 조회. 없으면 `data:null, isEmpty:true`. */
export function usePastMeeting(id: string): DataResult<PastMeeting | null> {
  return useSeedFind(pastMeetings.find((p) => p.id === id));
}
