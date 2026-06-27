/**
 * 조리 가이드 · 정산 체크리스트 API DTO (백엔드 session-controller 1:1).
 * 출처: docs/generated/api-schema.md.
 */
import type { SessionIngredientResponse } from './mySession';
import type { PurchaseItemResponse } from '../session';

export interface CookingUsedIngredientResponse {
  ingredientId: number;
  nameKo: string;
  plannedUseGrams: number | null;
}

export interface ParticipantTaskResponse {
  participantId: number;
  nickname: string;
  taskName: string;
  taskPurpose: string;
  taskDetail: string;
  attentionPoints: string[];
  displayInstruction: string;
  skillRequired: string;
}

export interface CookingGuideStepResponse {
  stepOrder: number;
  phase: string;
  title: string;
  estimatedMinutes: number;
  instruction: string;
  usedIngredients: CookingUsedIngredientResponse[];
  tools: string[];
  kitItems: string[];
  participantTasks: ParticipantTaskResponse[];
  safetyNote: string | null;
  completionCriteria: string | null;
}

export interface CookingGuideResponse {
  slotId: number;
  menuName: string;
  steps: CookingGuideStepResponse[];
}

export interface SessionChecklistResponse {
  slotId: number;
  menuName: string;
  menuType: string;
  myIngredients: SessionIngredientResponse[];
  commonKitItems: string[];
  purchaseItems: PurchaseItemResponse[];
  reservationCredit: number;
  refundHint: string;
}
