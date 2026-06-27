/**
 * 세션·추천·투표·조리 가이드·체크리스트·리포트 API
 * (api-schema.md session/recommendation/menu-vote/consumption-result-controller §).
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
import type { CookingGuideResponse, SessionChecklistResponse } from '@/types/api/cookingGuide';
import type { SessionResultResponse } from '@/types/api/mySession';

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

/** 단계별 조리 가이드. `GET /api/v1/sessions/{slotId}/cooking-guide` */
export function getCookingGuide(slotId: number): Promise<CookingGuideResponse> {
  return apiRequest<CookingGuideResponse>(`/sessions/${slotId}/cooking-guide`);
}

/** 준비물 체크리스트·예약 크레딧·환불 힌트. `GET /api/v1/sessions/{slotId}/checklist` */
export function getSessionChecklist(slotId: number): Promise<SessionChecklistResponse> {
  return apiRequest<SessionChecklistResponse>(`/sessions/${slotId}/checklist`);
}

/** 세션 탄소 절감 리포트. `GET /api/v1/sessions/{slotId}/result` */
export function getSessionResult(slotId: number): Promise<SessionResultResponse> {
  return apiRequest<SessionResultResponse>(`/sessions/${slotId}/result`);
}
