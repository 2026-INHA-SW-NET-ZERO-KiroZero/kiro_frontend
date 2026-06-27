import * as SecureStore from 'expo-secure-store';

import type { VoteType } from '@/types/session';

const KEY_PREFIX = 'kiro_menu_vote_progress';

export interface MenuVoteProgress {
  slotId: number;
  recommendationCount: number;
  voteType: VoteType;
  candidateLabel?: string;
}

function key(slotId: number): string {
  return `${KEY_PREFIX}:${slotId}`;
}

export const voteProgressStorage = {
  async get(slotId: number): Promise<MenuVoteProgress | null> {
    const raw = await SecureStore.getItemAsync(key(slotId));
    if (raw == null) return null;

    try {
      return JSON.parse(raw) as MenuVoteProgress;
    } catch {
      await SecureStore.deleteItemAsync(key(slotId));
      return null;
    }
  },

  set(progress: MenuVoteProgress): Promise<void> {
    return SecureStore.setItemAsync(key(progress.slotId), JSON.stringify(progress));
  },

  clear(slotId: number): Promise<void> {
    return SecureStore.deleteItemAsync(key(slotId));
  },
};
