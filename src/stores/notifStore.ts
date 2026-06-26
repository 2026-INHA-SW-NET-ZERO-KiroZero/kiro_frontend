/**
 * 알림 읽음 상태 전역 스토어 (PRD §4.1 `AppState.notifRead`).
 *
 * 읽음 처리는 세션 동안 유지되는 전역 상태라 화면-로컬 useState가 아닌 Zustand로 둔다.
 * id → 읽음(true) 매핑만 보관하고, 최종 unread 반영은 `useNotifications()` 훅이 한다.
 */
import { create } from 'zustand';

export interface NotifState {
  /** id → 읽음 여부. 키가 없으면 시드의 `unread` 값을 그대로 따른다. */
  notifRead: Record<string, boolean>;
  markRead: (id: string) => void;
  markAllRead: (ids: string[]) => void;
}

export const useNotifStore = create<NotifState>((set) => ({
  notifRead: {},
  markRead: (id) => set((state) => ({ notifRead: { ...state.notifRead, [id]: true } })),
  markAllRead: (ids) =>
    set((state) => {
      const next = { ...state.notifRead };
      for (const id of ids) next[id] = true;
      return { notifRead: next };
    }),
}));
