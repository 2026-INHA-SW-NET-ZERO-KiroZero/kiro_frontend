/**
 * 내 신청 내역 시드.
 *
 * issue #33부터 `useMyApplications()`가 `GET /api/v1/me/sessions`로 직접 데이터를 받으므로
 * 더미 시드는 비운다. (data/index 재export 유지 — 다른 모듈 import 경로 보존)
 */
import type { MyApplication } from '@/types';

export const myApplications: MyApplication[] = [];
