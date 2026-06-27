/**
 * 데이터 접근 커스텀 훅 barrel. UI는 `src/data/`를 직접 import하지 않고
 * 여기 훅으로만 데이터에 접근한다(API 교체 대비, PRD §5).
 */
export { useMe } from './useMe';
export { useAllergyOptions } from './useAllergyOptions';
export { useRooms, useRoomDetail } from './useRooms';
export { useHomeRooms, toHomeRoomCard } from './useHomeRooms';
export type { HomeRoomCard, HomeRoomAvatar, UseHomeRoomsResult } from './useHomeRooms';
export { useAggIngredients } from './useAggIngredients';
export { useIngredients } from './useIngredients';
export {
  useMenuCandidates,
  useVoteMenus,
  useDecidedMenu,
  useSubmitVote,
  useVoteConfirmed,
} from './useMenus';
export { useNotifications } from './useNotifications';
export type { NotifResult } from './useNotifications';
export { useMyApplications, useMyApplication } from './useMyApplications';
export { useSettlement } from './useSettlement';
export { usePastMeetings, usePastMeeting } from './usePastMeetings';
export type { PastMeetingResult } from './usePastMeetings';
export { usePartyPool } from './usePartyPool';
export { useReport } from './useReport';
export type { ReportBar, ReportView, UseReportResult } from './useReport';
export { useResultTotal } from './useResultTotal';
export { useCookingGuide } from './useCookingGuide';
export { useSessionResult } from './useSessionResult';
export { useAuth, AuthContext } from './useAuth';
export { useProfile, ProfileContext, useProfileProvider } from './useProfile';
export { usePastEval, PastEvalContext, usePastEvalProvider } from './usePastEval';
