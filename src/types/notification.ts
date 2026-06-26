/** 알림 관련 공유 타입 (PRD §3.15 · §5). */

/** 알림 종류 — 탭 라우팅과 아이콘/톤을 결정. */
export type NotifType = 'vote' | 'revote' | 'recipe' | 'eval';

/** 알림 톤 (아이콘 타일 색 계열). */
export type NotifTone = 'red' | 'amber' | 'green';

export interface Notif {
  id: string;
  type: NotifType;
  tone: NotifTone;
  /** Material Symbols 아이콘명. */
  icon: string;
  title: string;
  body: string;
  /** 상대 시각 표기 (예: '방금', '12분 전'). */
  time: string;
  unread: boolean;
}
