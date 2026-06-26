import { useCallback } from 'react';

import { getSlotDetail, listSlots } from '@/lib/slotApi';
import { avatarPalette } from '@/theme/theme';
import type { Room, SlotDetailResponse, SlotListItemResponse } from '@/types';

import { useApiData, type AsyncResult } from './useApiData';

/** 'YYYY-MM-DD' → 'MM.DD (요일)' */
function formatSlotDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} (${days[d.getDay()]})`;
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function slotItemToRoom(slot: SlotListItemResponse): Room {
  return {
    id: String(slot.slotId),
    title: slot.placeName,
    date: formatSlotDate(slot.date),
    time: slot.startTime,
    place: slot.placeName,
    tags: ['저녁', '조리실습실'],
    capacity: slot.capacity,
    baseCount: slot.participantCount,
    host: '',
    parts: [],
    prev: [],
  };
}

function slotDetailToRoom(slot: SlotDetailResponse): Room {
  return {
    id: String(slot.slotId),
    title: slot.placeName,
    date: formatSlotDate(slot.date),
    time: slot.startTime,
    place: slot.placeName,
    tags: ['저녁', '조리실습실'],
    capacity: slot.capacity,
    baseCount: Number(slot.participantCount),
    host: slot.participants[0]?.nickname ?? '',
    parts: slot.participants.map((p, i) => ({
      n: p.nickname,
      c: avatarPalette[Math.floor(Math.random() * avatarPalette.length)],
    })),
    prev: [],
    joined: slot.joined,
  };
}

/** 오늘 열린 방 목록. */
export function useRooms(): AsyncResult<Room[]> {
  const fetcher = useCallback(
    () => listSlots(todayISO(), 'OPEN').then((res) => res.slots.map(slotItemToRoom)),
    [],
  );
  return useApiData(fetcher, { initial: [], isEmpty: (d) => d.length === 0 });
}

/** 방 상세 — slotId 문자열로 단건 조회. */
export function useRoomDetail(id: string): AsyncResult<Room | null> {
  const slotId = Number(id);
  const fetcher = useCallback(
    () => (isNaN(slotId) ? Promise.resolve(null) : getSlotDetail(slotId).then(slotDetailToRoom)),
    [slotId],
  );
  return useApiData(fetcher, { initial: null, isEmpty: (d) => d === null });
}
