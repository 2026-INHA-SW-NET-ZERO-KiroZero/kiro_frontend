/** 내 신청 내역 데이터 훅. (API 교체 지점: `GET /me/applications`) */
import { myApplications } from '@/data';
import type { DataResult, MyApplication } from '@/types';

import { useSeedFind, useSeedList } from './useSeed';

/** 내 신청 내역 목록. */
export function useMyApplications(): DataResult<MyApplication[]> {
  return useSeedList(myApplications);
}

/** 신청 내역 단건 — id로 조회. 없으면 `data:null, isEmpty:true`. */
export function useMyApplication(id: string): DataResult<MyApplication | null> {
  return useSeedFind(myApplications.find((a) => a.id === id));
}
