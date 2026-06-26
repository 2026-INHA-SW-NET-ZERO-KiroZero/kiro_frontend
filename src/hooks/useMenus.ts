/** 메뉴(추천/투표/확정) 데이터 훅. (API 교체 지점: 백엔드 AI 추천/투표/확정 결과) */
import { decidedMenu, menuCandidates, voteMenus } from '@/data';
import type { DataResult, DecidedMenu, MenuCandidate, VoteMenu } from '@/types';

import { useSeedList, useSeedValue } from './useSeed';

/** AI 추천 메뉴 후보 (recommend 화면). */
export function useMenuCandidates(): DataResult<MenuCandidate[]> {
  return useSeedList(menuCandidates);
}

/** 투표 후보 메뉴 (myApplication 투표 단계). */
export function useVoteMenus(): DataResult<VoteMenu[]> {
  return useSeedList(voteMenus);
}

/** 투표로 확정된 메뉴 (myApplication result 단계). */
export function useDecidedMenu(): DataResult<DecidedMenu> {
  return useSeedValue(decidedMenu);
}
