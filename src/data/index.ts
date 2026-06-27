/**
 * 더미데이터 시드 barrel (PRD §5). **UI는 이 모듈을 직접 import하지 않는다** —
 * 반드시 `src/hooks/`의 커스텀 훅(`useRooms()` 등)으로만 접근한다(API 교체 대비).
 */
export { notifData } from './notifications';
export { settlementData } from './settlement';
export { pastMeetings, pastEvaluatedSeed } from './pastMeetings';
