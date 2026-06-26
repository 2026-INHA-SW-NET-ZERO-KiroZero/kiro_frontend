/** 알림 데이터 훅. (API 교체 지점: 백엔드 알림 목록/푸시) */
import { useMemo } from 'react';

import { notifData } from '@/data';
import { useNotifStore } from '@/stores/notifStore';
import type { Notif } from '@/types';

export interface NotifResult {
  /** notifRead가 반영된 최종 목록 (읽음 처리 시 `unread` override). */
  data: Notif[];
  /** data에서 `unread === true`인 항목 수. */
  unreadCount: number;
  markRead: (id: string) => void;
  /** notifData의 모든 id를 한 번에 읽음 처리. */
  markAllRead: () => void;
}

export function useNotifications(): NotifResult {
  const notifRead = useNotifStore((s) => s.notifRead);
  const storeMarkRead = useNotifStore((s) => s.markRead);
  const storeMarkAllRead = useNotifStore((s) => s.markAllRead);

  const data = useMemo<Notif[]>(
    () => notifData.map((n) => (notifRead[n.id] ? { ...n, unread: false } : n)),
    [notifRead],
  );

  const unreadCount = useMemo(() => data.reduce((acc, n) => (n.unread ? acc + 1 : acc), 0), [data]);

  const markAllRead = () => storeMarkAllRead(notifData.map((n) => n.id));

  return { data, unreadCount, markRead: storeMarkRead, markAllRead };
}
