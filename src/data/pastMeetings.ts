/**
 * 더미데이터 시드 — 지난 모임 2건. `past2`는 평가 완료 상태.
 * (PRD §3.10 · §3.11 · §5, 값 출처: KiroZero.dc.html `this.pastMeetings`)
 *
 * 참여자 색은 디자인 원본과 동일하게 theme 토큰을 참조한다.
 *
 * TODO(API): 백엔드 연동 시 `GET /me/past-meetings`로 교체. `usePastMeetings()`/`usePastMeeting(id)` 경유.
 */
import { color } from '@/theme/theme';
import type { PastMeeting } from '@/types';

/**
 * 사전 평가 완료 시드 — `past2`는 이미 평가됨(평가 완료 분기 확인용).
 * (출처: KiroZero.dc.html state `pastEvaluated:{past2:true}`)
 */
export const pastEvaluatedSeed: Record<string, boolean> = { past2: true };

export const pastMeetings: PastMeeting[] = [
  {
    id: 'past1',
    emoji: '🍝',
    title: '토마토 파스타 같이 만들기',
    date: '06.18 (목) 19:00',
    place: '5호관 조리실습실 A',
    members: '4/4명',
    state: '조리 완료',
    saved: '0.9kg',
    menu: { emoji: '🍝', name: '냉파 토마토 파스타', time: '30분', servings: '4인분' },
    foodKg: '0.9kg',
    co2: '2.3kg',
    rate: 92,
    km: '9.6km',
    meals: '1.4끼',
    seedEval: { food: 100, use: { '토마토 3개': 75, '양파 1개': 100 } },
    parts: [
      {
        label: '나',
        isMe: true,
        color: color.purple,
        skill: '중',
        brought: '토마토 3개 · 양파 1개',
      },
      { label: '참여자 1', color: color.brand, skill: '상', brought: '파스타면 400g' },
      { label: '참여자 2', color: color.eco, skill: '중', brought: '베이컨 100g' },
      { label: '참여자 3', color: color.goldSoft, skill: '하', brought: '마늘 · 올리브유' },
    ],
  },
  {
    id: 'past2',
    emoji: '🍚',
    title: '남은 채소 비빔밥 모임',
    date: '06.11 (목) 18:30',
    place: '학생회관 공유주방',
    members: '4/4명',
    state: '조리 완료',
    saved: '0.7kg',
    menu: { emoji: '🍚', name: '냉장고 털이 비빔밥', time: '25분', servings: '4인분' },
    foodKg: '0.7kg',
    co2: '1.8kg',
    rate: 88,
    km: '7.5km',
    meals: '1.1끼',
    seedEval: { food: 100, use: { 당근: 75, 애호박: 100 } },
    parts: [
      { label: '나', isMe: true, color: color.purple, skill: '중', brought: '당근 · 애호박' },
      { label: '참여자 1', color: color.brand, skill: '중', brought: '밥 4공기' },
      { label: '참여자 2', color: color.eco, skill: '상', brought: '계란 4개 · 고추장' },
      { label: '참여자 3', color: color.goldSoft, skill: '하', brought: '시금치 · 콩나물' },
    ],
  },
];
