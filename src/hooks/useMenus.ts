/**
 * 메뉴 추천·투표·확정 데이터 훅.
 * GET /api/v1/sessions/{slotId}/recommendations/latest 기반.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { menuTypeLabel, plannedFoodWasteText, toDecidedMenu } from '@/lib/menuFlow';
import { getLatestRecommendation, requestRecommendation, submitVoteApi } from '@/lib/sessionApi';
import type { DecidedMenu, MenuCandidate, VoteMenu } from '@/types';
import type { CookingGuideResponse } from '@/types/api/cookingGuide';
import type {
  MenuCandidateResponse,
  MenuVoteRequest,
  MenuVoteResponse,
  SessionStatus,
} from '@/types/session';

import { useApiData, type AsyncResult } from './useApiData';

function toMenuCandidate(c: MenuCandidateResponse): MenuCandidate {
  return {
    candidateLabel: c.candidateLabel,
    name: c.menuName,
    type: menuTypeLabel(c.menuType),
    time: `${c.cookingTimeMinutes}분`,
    diff: c.difficulty,
    desc: c.recommendationReason,
    needed: c.usedLeftoverIngredients.map((ing) => ({
      n: ing.nameKo,
      q: ing.plannedUseGrams != null ? `${ing.plannedUseGrams}g` : '',
    })),
    missing: c.purchaseItems.map((p) => ({
      n: p.name,
      q: `${p.quantityGrams}g`,
    })),
  };
}

function toVoteMenu(c: MenuCandidateResponse, votes: number): VoteMenu {
  return {
    key: c.candidateLabel,
    candidateLabel: c.candidateLabel,
    name: c.menuName,
    type: menuTypeLabel(c.menuType),
    desc: c.recommendationReason,
    votes,
    co2: plannedFoodWasteText(c),
    purchase:
      c.purchaseItems.length > 0
        ? {
            item: c.purchaseItems.map((p) => p.name).join(', '),
            buyer: c.purchaseItems[0]?.assignedToNickname ?? '',
            cost: `${c.purchaseItems.reduce((acc, p) => acc + p.estimatedCost, 0)}원`,
          }
        : null,
  };
}

/** AI 추천 메뉴 후보 (recommend 화면). */
export function useMenuCandidates(slotId: number): AsyncResult<MenuCandidate[]> {
  const fetcher = useCallback(
    () => getLatestRecommendation(slotId).then((res) => res.candidates.map(toMenuCandidate)),
    [slotId],
  );
  return useApiData(fetcher, { initial: [], isEmpty: (d) => d.length === 0 });
}

/** 투표 후보 메뉴 (myApplication 투표 단계). */
export function useVoteMenus(slotId: number): AsyncResult<VoteMenu[]> {
  const fetcher = useCallback(
    () =>
      getLatestRecommendation(slotId).then((res) => res.candidates.map((c) => toVoteMenu(c, 0))),
    [slotId],
  );
  return useApiData(fetcher, { initial: [], isEmpty: (d) => d.length === 0 });
}

/** 투표로 확정된 메뉴 (myApplication result 단계). selectedMenu 요약만 반환. */
export function useDecidedMenu(
  slotId: number,
  cookingGuide: CookingGuideResponse | null = null,
  myParticipantId?: number | null,
): AsyncResult<DecidedMenu | null> {
  const fetcher = useCallback(
    () =>
      getLatestRecommendation(slotId).then((res) =>
        toDecidedMenu(res, cookingGuide, myParticipantId),
      ),
    [slotId, cookingGuide, myParticipantId],
  );
  return useApiData(fetcher, { initial: null, isEmpty: (d) => d === null });
}

interface UseSubmitVoteResult {
  submit: (req: MenuVoteRequest) => Promise<MenuVoteResponse>;
  loading: boolean;
  error: Error | null;
}

/** 투표 제출 뮤테이션 훅. */
export function useSubmitVote(slotId: number): UseSubmitVoteResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(
    async (req: MenuVoteRequest): Promise<MenuVoteResponse> => {
      setLoading(true);
      setError(null);
      try {
        const res = await submitVoteApi(slotId, req);
        return res;
      } catch (e) {
        const err = e instanceof Error ? e : new Error('투표 제출에 실패했어요.');
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [slotId],
  );

  return { submit, loading, error };
}

interface UseVoteConfirmedResult {
  confirmed: boolean;
  voteSummary: Record<string, number>;
}

/**
 * 투표 확정 폴링 훅.
 * 내가 투표를 제출해도 다른 인원이 미완료면 confirmed=false — 서버 푸시 없이 폴링으로만 확인 가능.
 * `enabled=true`일 때 5초 간격으로 최신 추천을 조회하고, confirmed되면 중단한다.
 */
export function useVoteConfirmed(
  slotId: number,
  enabled: boolean,
  initialSummary: Record<string, number> = {},
): UseVoteConfirmedResult {
  const [confirmed, setConfirmed] = useState(false);
  const [voteSummary] = useState<Record<string, number>>(initialSummary);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled || confirmed) return;

    const poll = () => {
      getLatestRecommendation(slotId)
        .then((res) => {
          if (res.status === 'COMPLETED' || res.selectedMenu != null) {
            setConfirmed(true);
          }
        })
        .catch(() => {
          // 폴링 실패는 무시하고 계속 시도
        });
    };

    timerRef.current = setInterval(poll, 5000);
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, [slotId, enabled, confirmed]);

  return { confirmed, voteSummary };
}

interface UseRecommendationResult {
  status: SessionStatus;
  candidates: MenuCandidate[];
  loading: boolean;
  error: Error | null;
  /** POST /sessions/{slotId}/recommendations 호출 후 GET latest 재조회. */
  generate: () => Promise<void>;
  generating: boolean;
  generateError: Error | null;
}

/** AI 추천 생성 + 후보 조회를 묶은 훅. recommend.tsx에서 사용. */
export function useRecommendation(slotId: number): UseRecommendationResult {
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<Error | null>(null);

  const fetcher = useCallback(
    () =>
      getLatestRecommendation(slotId).then((res) => ({
        status: res.status,
        candidates: res.candidates.map(toMenuCandidate),
      })),
    [slotId],
  );

  const { data, loading, error, refetch } = useApiData(fetcher, {
    initial: { status: 'OPEN' as SessionStatus, candidates: [] },
    isEmpty: (d) => d.candidates.length === 0,
  });

  const generate = useCallback(async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      await requestRecommendation(slotId);
      refetch();
    } catch (e) {
      const err = e instanceof Error ? e : new Error('AI 추천 생성에 실패했어요.');
      setGenerateError(err);
    } finally {
      setGenerating(false);
    }
  }, [slotId, refetch]);

  return {
    status: data.status,
    candidates: data.candidates,
    loading,
    error,
    generate,
    generating,
    generateError,
  };
}

interface UseVoteRecommendationResult {
  status: SessionStatus;
  voteMenus: VoteMenu[];
  loading: boolean;
  error: Error | null;
  /** POST /sessions/{slotId}/recommendations 호출 후 GET latest 재조회. */
  generate: () => Promise<void>;
  generating: boolean;
  generateError: Error | null;
}

/** 투표 단계에서 추천 생성 + VoteMenu 목록 조회를 묶은 훅. MyApplicationScreen에서 사용. */
export function useVoteRecommendation(slotId: number): UseVoteRecommendationResult {
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<Error | null>(null);

  const fetcher = useCallback(
    () =>
      getLatestRecommendation(slotId).then((res) => ({
        status: res.status,
        voteMenus: res.candidates.map((c) => toVoteMenu(c, 0)),
      })),
    [slotId],
  );

  const { data, loading, error, refetch } = useApiData(fetcher, {
    initial: { status: 'OPEN' as SessionStatus, voteMenus: [] },
    isEmpty: (d) => d.voteMenus.length === 0,
  });

  const generate = useCallback(async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      await requestRecommendation(slotId);
      refetch();
    } catch (e) {
      const err = e instanceof Error ? e : new Error('AI 추천 생성에 실패했어요.');
      setGenerateError(err);
    } finally {
      setGenerating(false);
    }
  }, [slotId, refetch]);

  return {
    status: data.status,
    voteMenus: data.voteMenus,
    loading,
    error,
    generate,
    generating,
    generateError,
  };
}
