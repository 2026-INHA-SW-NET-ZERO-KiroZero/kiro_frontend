/**
 * 세션·추천·투표 API (api-schema.md session/recommendation/menu-vote-controller §).
 * 훅 내부에서만 호출한다 — UI는 훅으로 접근.
 */
import { apiRequest } from '@/lib/apiClient';
import type {
  LatestRecommendationResponse,
  MenuVoteRequest,
  MenuVoteResponse,
  RecommendationResponse,
  SessionStatusResponse,
  UpdateSessionIngredientsRequest,
  UpdateSessionIngredientsResponse,
} from '@/types/session';

/** 세션 현황(참여자·공유 재료 풀). `GET /api/v1/sessions/{slotId}` */
export function getSession(slotId: number): Promise<SessionStatusResponse> {
  console.warn(`GET /api/v1/sessions/${slotId} request:`, { slotId });
  return apiRequest<SessionStatusResponse>(`/sessions/${slotId}`).then((res) => {
    console.warn(`GET /api/v1/sessions/${slotId} response:`, res);
    return res;
  });
}

/** 내 등록 재료 수정. `PUT /api/v1/sessions/{slotId}/ingredients` */
export function updateSessionIngredients(
  slotId: number,
  body: UpdateSessionIngredientsRequest,
): Promise<UpdateSessionIngredientsResponse> {
  console.warn(`PUT /api/v1/sessions/${slotId}/ingredients request:`, body);
  return apiRequest<UpdateSessionIngredientsResponse>(`/sessions/${slotId}/ingredients`, {
    method: 'PUT',
    body,
  }).then((res) => {
    console.warn(`PUT /api/v1/sessions/${slotId}/ingredients response:`, res);
    return res;
  });
}

/** 메뉴 추천 요청. `POST /api/v1/sessions/{slotId}/recommendations` */
export function requestRecommendation(slotId: number): Promise<RecommendationResponse> {
  console.warn(`POST /api/v1/sessions/${slotId}/recommendations request:`, { slotId });
  return apiRequest<RecommendationResponse>(`/sessions/${slotId}/recommendations`, {
    method: 'POST',
  }).then((res) => {
    console.warn(`POST /api/v1/sessions/${slotId}/recommendations response:`, res);
    return res;
  });
}

/** 최신 추천 + 선택 메뉴. `GET /api/v1/sessions/{slotId}/recommendations/latest` */
export function getLatestRecommendation(slotId: number): Promise<LatestRecommendationResponse> {
  console.warn(`GET /api/v1/sessions/${slotId}/recommendations/latest request:`, { slotId });
  return apiRequest<LatestRecommendationResponse>(
    `/sessions/${slotId}/recommendations/latest`,
  ).then((res) => {
    console.warn(`GET /api/v1/sessions/${slotId}/recommendations/latest response:`, res);
    return res;
  });
}

/** 메뉴 투표. `POST /api/v1/sessions/{slotId}/votes` */
export function submitVoteApi(slotId: number, body: MenuVoteRequest): Promise<MenuVoteResponse> {
  console.warn(`POST /api/v1/sessions/${slotId}/votes request:`, body);
  return apiRequest<MenuVoteResponse>(`/sessions/${slotId}/votes`, { method: 'POST', body }).then(
    (res) => {
      console.warn(`POST /api/v1/sessions/${slotId}/votes response:`, res);
      return res;
    },
  );
}
