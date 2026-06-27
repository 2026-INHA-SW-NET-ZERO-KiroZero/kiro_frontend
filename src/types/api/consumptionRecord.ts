/**
 * 사용량 기록(= 모임 평가 제출) API DTO.
 * `POST /api/v1/sessions/{slotId}/consumption-records` (백엔드 consumption-record-controller 1:1).
 * 출처: docs/generated/api-schema.md.
 */
import type { SlotStatus } from './mySession';

export interface ConsumptionRecordItemRequest {
  sessionIngredientId: number;
  /** 재료 소진율 % (0~100). */
  useRate: number;
}

export interface CreateConsumptionRecordRequest {
  /** 완성 음식 소비율 % (0~100). */
  finishedFoodRate: number;
  cookedPhotoUrl: string;
  afterPhotoUrl: string;
  items: ConsumptionRecordItemRequest[];
}

export interface CreateConsumptionRecordResponse {
  recordId: number;
  slotId: number;
  refundScore: number;
  refundAmountPerUser: number;
  totalUsedGrams: number;
  estimatedCarbonSavedKgco2e: number;
  campusReportLogged: boolean;
  nextStatus: SlotStatus;
}
