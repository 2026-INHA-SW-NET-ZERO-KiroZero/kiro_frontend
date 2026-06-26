/** 방(슬롯) API 응답 타입 (Swagger slot-controller 기준). */

export interface SlotListItemResponse {
  slotId: number;
  date: string;
  placeName: string;
  stationCode: string;
  startTime: string;
  endTime: string;
  capacity: number;
  participantCount: number;
  status: string;
  commonKitSummary: string[];
}

export interface SlotListResponse {
  slots: SlotListItemResponse[];
}

export interface SlotDetailParticipantResponse {
  participantId: number;
  nickname: string;
  cookingSkill: string;
  allergyTags: string[];
  canPurchase: boolean;
  ingredientCount: number;
}

export interface SlotDetailResponse {
  slotId: number;
  date: string;
  placeName: string;
  stationCode: string;
  startTime: string;
  endTime: string;
  capacity: number;
  participantCount: number;
  status: string;
  commonKit: string[];
  joined: boolean;
  myParticipantId: number;
  participants: SlotDetailParticipantResponse[];
}

export interface JoinIngredientRequest {
  ingredientId: number;
  count: number;
  knownGrams?: number;
}

export interface JoinSlotRequest {
  canPurchase: boolean;
  ingredients: JoinIngredientRequest[];
}

export interface JoinSlotResponse {
  slotId: number;
  participantId: number;
  status: string;
  canPurchase: boolean;
}

export interface LeaveSlotResponse {
  slotId: number;
  status: string;
  left: boolean;
}
