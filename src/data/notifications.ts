/**
 * 더미데이터 시드 — 알림 6건. (PRD §3.15 · §5, 값 출처: KiroZero.dc.html `this.notifData`)
 *
 * TODO(API): 알림은 백엔드 푸시/목록으로 교체. `useNotifications()` 경유.
 */
import type { Notif } from '@/types';

export const notifData: Notif[] = [
  {
    id: 'n1',
    type: 'vote',
    tone: 'red',
    icon: 'how_to_vote',
    title: '메뉴 투표가 시작됐어요',
    body: '‘토마토 파스타 같이 만들기’ 모임 인원이 모두 모여 마감됐어요. 메뉴 투표에 참여해 주세요.',
    time: '방금',
    unread: true,
  },
  {
    id: 'n2',
    type: 'revote',
    tone: 'amber',
    icon: 'replay',
    title: '재투표가 열렸어요',
    body: '다른 참여자가 메뉴 재추천을 요청해 투표가 다시 열렸어요. 한 번 더 골라 주세요.',
    time: '12분 전',
    unread: true,
  },
  {
    id: 'n3',
    type: 'recipe',
    tone: 'green',
    icon: 'restaurant_menu',
    title: '메뉴가 확정됐어요',
    body: '‘간장 계란밥’으로 정해졌어요. 내가 준비할 재료와 추가로 살 품목을 확인하세요.',
    time: '1시간 전',
    unread: true,
  },
  {
    id: 'n4',
    type: 'eval',
    tone: 'red',
    icon: 'rate_review',
    title: '모임은 어땠나요?',
    body: '‘남은 채소 비빔밥 모임’이 끝났어요. 평가를 남기고 나뭇잎을 받아가세요.',
    time: '어제',
    unread: false,
  },
  {
    id: 'n5',
    type: 'recipe',
    tone: 'green',
    icon: 'restaurant_menu',
    title: '메뉴가 확정됐어요',
    body: '‘새우 로제 파스타’로 정해졌어요. 준비물과 추가 구매 품목을 확인하세요.',
    time: '2일 전',
    unread: false,
  },
  {
    id: 'n6',
    type: 'eval',
    tone: 'red',
    icon: 'rate_review',
    title: '모임 평가가 반영됐어요',
    body: '‘들기름 막국수 모임’ 평가가 반영돼 나뭇잎 32장을 받았어요.',
    time: '3일 전',
    unread: false,
  },
];
