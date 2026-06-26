/** 방(모임) 데이터 훅. (API 교체 지점: `GET /rooms`, `GET /rooms/:id`) */
import { rooms } from '@/data';
import type { DataResult, Room } from '@/types';

import { useSeedFind, useSeedList } from './useSeed';

/** 오늘 열린 방 목록. */
export function useRooms(): DataResult<Room[]> {
  return useSeedList(rooms);
}

/** 방 상세 — id로 단건 조회. 없으면 `data:null, isEmpty:true`. */
export function useRoomDetail(id: string): DataResult<Room | null> {
  return useSeedFind(rooms.find((r) => r.id === id));
}
