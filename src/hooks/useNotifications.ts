/** 알림 데이터 훅. (API 교체 지점: 백엔드 알림 목록/푸시) */
import { notifData } from '@/data';
import type { DataResult, Notif } from '@/types';

import { useSeedList } from './useSeed';

export function useNotifications(): DataResult<Notif[]> {
  return useSeedList(notifData);
}
