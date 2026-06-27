/** 내 신청 내역 데이터 훅. GET /api/v1/me/sessions 기반. */
import { useCallback } from 'react';

import { listMySessions } from '@/lib/sessionApi';
import type { MyApplication } from '@/types';
import type { MySessionItemResponse } from '@/types/session';

import { useApiData, type AsyncResult } from './useApiData';

const KO_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  return `${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')} (${KO_DAYS[dow]})`;
}

function calcDday(iso: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return '마감';
  if (diff === 0) return 'D-Day';
  return `D-${diff}`;
}

function toMyApplication(s: MySessionItemResponse): MyApplication {
  return {
    id: String(s.slotId),
    title: s.placeName,
    place: s.placeName,
    date: formatDate(s.date),
    time: s.startTime.slice(0, 5),
    capacity: s.capacity,
    count: Number(s.participantCount),
    dday: calcDday(s.date),
    status: s.status,
  };
}

/** 내 신청 내역 목록. */
export function useMyApplications(): AsyncResult<MyApplication[]> {
  const fetcher = useCallback(
    () => listMySessions().then((res) => res.sessions.map(toMyApplication)),
    [],
  );
  return useApiData(fetcher, { initial: [], isEmpty: (d) => d.length === 0 });
}

/** 신청 내역 단건 — slotId(id)로 목록에서 조회. */
export function useMyApplication(id: string): AsyncResult<MyApplication | null> {
  const fetcher = useCallback(
    () =>
      listMySessions().then((res) => {
        const found = res.sessions.find((s) => String(s.slotId) === id);
        return found != null ? toMyApplication(found) : null;
      }),
    [id],
  );
  return useApiData(fetcher, { initial: null, isEmpty: (d) => d === null });
}
