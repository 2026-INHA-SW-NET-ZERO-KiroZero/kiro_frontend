/**
 * 슬롯(4인 방) API (api-schema.md slot-controller §).
 * 훅 내부에서만 호출한다 — UI는 훅으로 접근.
 */
import { apiRequest } from '@/lib/apiClient';
import type {
  JoinSlotRequest,
  JoinSlotResponse,
  LeaveSlotResponse,
  SlotDetailResponse,
  SlotListResponse,
} from '@/types/slot';

/** 슬롯(방) 목록. `GET /api/v1/slots?date={date}&status={status}` */
export function listSlots(date: string, status?: string): Promise<SlotListResponse> {
  const params = new URLSearchParams({ date });
  if (status !== undefined) params.set('status', status);
  return apiRequest<SlotListResponse>(`/slots?${params.toString()}`);
}

/** 슬롯 상세. `GET /api/v1/slots/{slotId}` */
export function getSlotDetail(slotId: number): Promise<SlotDetailResponse> {
  return apiRequest<SlotDetailResponse>(`/slots/${slotId}`);
}

/** 방 참여(재료 등록). `POST /api/v1/slots/{slotId}/join` */
export function joinSlot(slotId: number, body: JoinSlotRequest): Promise<JoinSlotResponse> {
  return apiRequest<JoinSlotResponse>(`/slots/${slotId}/join`, { method: 'POST', body });
}

/** 방 나가기. `DELETE /api/v1/slots/{slotId}/join` */
export function leaveSlot(slotId: number): Promise<LeaveSlotResponse> {
  console.log('[leaveSlot] REQUEST', { slotId });
  return apiRequest<LeaveSlotResponse>(`/slots/${slotId}/join`, { method: 'DELETE' }).then(
    (res) => {
      console.log('[leaveSlot] RESPONSE', res);
      return res;
    },
    (err: unknown) => {
      console.error('[leaveSlot] ERROR', err);
      throw err;
    },
  );
}
