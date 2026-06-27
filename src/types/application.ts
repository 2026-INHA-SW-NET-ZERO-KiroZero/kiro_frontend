/** 신청 내역 관련 공유 타입 (PRD §3.9 · §5). */

import type { SessionStatus } from './session';

/**
 * 내 신청 내역 카드. 단계(canceled/recruiting/voting/result)는
 * `count`/`capacity`/`canceled` + 화면 상태에서 파생된다.
 */
export interface MyApplication {
  id: string;
  title: string;
  place: string;
  stationCode?: string;
  date: string;
  time: string;
  capacity: number;
  count: number;
  /** D-day 표기 (예: 'D-2', '마감'). */
  dday: string;
  /** 인원 미달로 모집이 취소된 경우. */
  canceled?: boolean;
  /** API 세션 상태 (OPEN | MENU_PROPOSED | COMPLETED). */
  status?: SessionStatus;
  /** 현재 사용자의 세션 참여자 ID. */
  myParticipantId?: number;
  /** 투표로 메뉴가 확정된 상태. */
  hasSelectedMenu?: boolean;
}
