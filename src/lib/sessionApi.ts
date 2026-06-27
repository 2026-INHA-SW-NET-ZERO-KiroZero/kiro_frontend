/**
 * 세션·추천·투표 API (api-schema.md session/recommendation/menu-vote-controller §).
 * 훅 내부에서만 호출한다 — UI는 훅으로 접근.
 */
import { apiRequest } from '@/lib/apiClient';
import type {
  LatestRecommendationResponse,
  MenuVoteRequest,
  MenuVoteResponse,
  MySessionDetailResponse,
  MySessionListResponse,
  RecommendationResponse,
  SessionStatusResponse,
  UpdateSessionIngredientsRequest,
  UpdateSessionIngredientsResponse,
} from '@/types/session';

/** 세션 현황(참여자·공유 재료 풀). `GET /api/v1/sessions/{slotId}` */
export function getSession(slotId: number): Promise<SessionStatusResponse> {
  return apiRequest<SessionStatusResponse>(`/sessions/${slotId}`);
}

/** 내 등록 재료 수정. `PUT /api/v1/sessions/{slotId}/ingredients` */
export function updateSessionIngredients(
  slotId: number,
  body: UpdateSessionIngredientsRequest,
): Promise<UpdateSessionIngredientsResponse> {
  return apiRequest<UpdateSessionIngredientsResponse>(`/sessions/${slotId}/ingredients`, {
    method: 'PUT',
    body,
  });
}

/** 메뉴 추천 요청. `POST /api/v1/sessions/{slotId}/recommendations` */
export function requestRecommendation(slotId: number): Promise<RecommendationResponse> {
  return apiRequest<RecommendationResponse>(`/sessions/${slotId}/recommendations`, {
    method: 'POST',
  });
}

/** 최신 추천 + 선택 메뉴. `GET /api/v1/sessions/{slotId}/recommendations/latest` */
export function getLatestRecommendation(slotId: number): Promise<LatestRecommendationResponse> {
  return apiRequest<LatestRecommendationResponse>(`/sessions/${slotId}/recommendations/latest`);
}

/** 메뉴 투표. `POST /api/v1/sessions/{slotId}/votes` */
export function submitVoteApi(slotId: number, body: MenuVoteRequest): Promise<MenuVoteResponse> {
  return apiRequest<MenuVoteResponse>(`/sessions/${slotId}/votes`, { method: 'POST', body });
}

/** 내 모임/신청 세션 목록. `GET /api/v1/me/sessions` */
export function listMySessions(): Promise<MySessionListResponse> {
  return apiRequest<MySessionListResponse>('/me/sessions');
}

/** 내 모임 세션 상세. `GET /api/v1/me/sessions/{slotId}` */
export function getMySessionDetail(slotId: number): Promise<MySessionDetailResponse> {
  return apiRequest<MySessionDetailResponse>(`/me/sessions/${slotId}`);
}
