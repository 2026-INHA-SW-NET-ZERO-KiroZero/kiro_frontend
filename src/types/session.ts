/** 세션·추천·투표 API 응답 타입 (Swagger session/recommendation/menu-vote-controller 기준). */

export type SessionStatus = 'OPEN' | 'MENU_PROPOSED' | 'COMPLETED';
export type VoteType = 'A' | 'B' | 'C' | 'D' | 'E';

export interface SessionIngredientStatusResponse {
  sessionIngredientId: number;
  ingredientId: number;
  nameKo: string;
  count: number;
  knownGrams: number | null;
  estimatedGrams: number | null;
}

export interface SessionParticipantStatusResponse {
  participantId: number;
  nickname: string;
  cookingSkill: 'HIGH' | 'MEDIUM' | 'LOW';
  allergyTags: string[];
  canPurchase: boolean;
  ingredients: SessionIngredientStatusResponse[];
}

export interface SharedIngredientPoolItemResponse {
  ingredientId: number;
  nameKo: string;
  totalCount: number;
  totalEstimatedGrams: number | null;
}

export interface SessionStatusResponse {
  slotId: number;
  status: SessionStatus;
  participants: SessionParticipantStatusResponse[];
  sharedIngredientPool: SharedIngredientPoolItemResponse[];
  canRequestRecommendation: boolean;
}

export interface UpdateSessionIngredientsRequest {
  items: { ingredientId: number; count: number; knownGrams?: number }[];
}

export interface UpdateSessionIngredientsResponse {
  slotId: number;
  items: SessionIngredientStatusResponse[];
}

export interface CandidateUsedIngredientResponse {
  ingredientId: number;
  nameKo: string;
  availableGrams: number | null;
  plannedUseGrams: number | null;
  estimatedUseRatio: number;
}

export interface PurchaseItemResponse {
  name: string;
  category: string;
  quantityGrams: number;
  allergenTags: string[];
  assignedToNickname: string;
  estimatedCost: number;
}

export interface MenuCandidateResponse {
  candidateLabel: string;
  menuName: string;
  menuType: string;
  usedLeftoverIngredients: CandidateUsedIngredientResponse[];
  commonKitItems: string[];
  purchaseItems: PurchaseItemResponse[];
  cookingTimeMinutes: number;
  difficulty: string;
  recommendationReason: string;
  cookingOutlineSteps: string[];
  rolePlanSummary: string[];
}

export interface RecommendationResponse {
  slotId: number;
  recommendationCount: number;
  status: SessionStatus;
  candidates: MenuCandidateResponse[];
}

export interface LatestRecommendationResponse {
  slotId: number;
  recommendationCount: number;
  status: SessionStatus;
  candidates: MenuCandidateResponse[];
  selectedMenu: SelectedMenuSummaryResponse | null;
}

export interface SelectedMenuSummaryResponse {
  candidateLabel: string;
  menuName: string;
  menuType: string;
}

export interface MenuVoteRequest {
  voteType: VoteType;
  candidateLabel: string;
  reasonText: string;
}

export interface MenuVoteResponse {
  slotId: number;
  recommendationCount: number;
  voteSummary: Record<string, number>;
  confirmed: boolean;
  confirmedCandidateLabel: string | null;
  selectedMenu: SelectedMenuSummaryResponse | null;
  nextStatus: SessionStatus;
}
