/**
 * 지난 모임 시드.
 *
 * issue #33부터 `usePastMeetings()`/`usePastMeeting(id)`가 `GET /api/v1/me/sessions`(+ 결과 API)로
 * 직접 데이터를 받고, 평가 완료 여부는 `usePastEval`이 제출 응답으로 관리하므로 시드를 비운다.
 */
import type { PastMeeting } from '@/types';

/** 평가 완료 초기 상태 — 빈 상태에서 시작하고 제출 응답이 truth. */
export const pastEvaluatedSeed: Record<string, boolean> = {};

export const pastMeetings: PastMeeting[] = [];
