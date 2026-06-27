/**
 * 내 모임(세션) 조회 API DTO (백엔드 my-session-controller · session-controller 1:1).
 * 출처: docs/generated/api-schema.md · docs/references/backend-swagger.json.
 */
import type { CookingSkill } from '../auth';

/** 슬롯(모임) 상태 enum. */
export type SlotStatus = 'OPEN' | 'MENU_PROPOSED' | 'COMPLETED';

export interface SelectedMenuSummaryResponse {
  candidateLabel: string;
  menuName: string;
  menuType: string;
}

export interface SessionIngredientResponse {
  sessionIngredientId: number;
  ingredientId: number;
  nameKo: string;
  count: number;
  knownGrams: number;
  estimatedGrams: number;
}

export interface SessionIngredientStatusResponse {
  sessionIngredientId: number;
  ingredientId: number;
  nameKo: string;
  count: number;
  knownGrams: number;
  estimatedGrams: number;
}

export interface SessionParticipantStatusResponse {
  participantId: number;
  nickname: string;
  cookingSkill: CookingSkill;
  allergyTags: string[];
  canPurchase: boolean;
  ingredients: SessionIngredientStatusResponse[];
}

/** 세션 현황 — 본 작업에서는 `participants`만 소비한다. */
export interface SessionStatusResponse {
  slotId: number;
  status: SlotStatus;
  participants: SessionParticipantStatusResponse[];
}

export interface MySessionItemResponse {
  slotId: number;
  participantId: number;
  /** ISO date — 예: "2026-06-26". */
  date: string;
  placeName: string;
  stationCode: string;
  /** 예: "18:00". */
  startTime: string;
  endTime: string;
  timeLabel: string;
  capacity: number;
  participantCount: number;
  status: SlotStatus;
  canPurchase: boolean;
  myIngredientCount: number;
  hasRecommendation: boolean;
  hasSelectedMenu: boolean;
  completed: boolean;
  /** 메뉴 미선택(OPEN 등) 시 null. */
  selectedMenu: SelectedMenuSummaryResponse | null;
}

export interface MySessionListResponse {
  sessions: MySessionItemResponse[];
}

export interface MySessionDetailResponse {
  slotId: number;
  myParticipantId: number;
  joined: boolean;
  canPurchase: boolean;
  status: SlotStatus;
  myIngredients: SessionIngredientResponse[];
  session: SessionStatusResponse;
  hasRecommendation: boolean;
  hasSelectedMenu: boolean;
  completed: boolean;
  selectedMenu: SelectedMenuSummaryResponse | null;
}

export interface PhotoUrlsResponse {
  cookedPhotoUrl: string;
  afterPhotoUrl: string;
}

export interface SessionResultResponse {
  slotId: number;
  menuName: string;
  menuType: string;
  totalUsedGrams: number;
  avgIngredientUseRate: number;
  finishedFoodRate: number;
  estimatedFoodWasteReducedGrams: number;
  estimatedCarbonSavedKgco2e: number;
  lowCarbonSelected: boolean;
  refundScore: number;
  refundAmountPerUser: number;
  totalRefundAmount: number;
  summaryText: string;
  photoUrls: PhotoUrlsResponse;
}

export interface ImageUploadResponse {
  fileUrl: string;
  objectKey: string;
  contentType: string;
  size: number;
}
