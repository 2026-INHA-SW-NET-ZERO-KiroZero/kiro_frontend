/**
 * 더미데이터 시드 — 내 신청 내역 3건 (recruiting/voting/result/canceled 단계 파생).
 * (PRD §3.9 · §5, 값 출처: KiroZero.dc.html `this.myApplications`)
 *
 * TODO(API): 백엔드 연동 시 `GET /me/applications`로 교체. `useMyApplications()` 경유.
 */
import type { MyApplication } from '@/types';

export const myApplications: MyApplication[] = [
  {
    id: 'app1',
    title: '1호관 517호 A팀',
    place: '1호관 517호',
    date: '06.26 (금)',
    time: '18:00',
    capacity: 4,
    count: 4,
    dday: 'D-2',
  },
  {
    id: 'app2',
    title: '5호관 조리실습실 B팀',
    place: '5호관 조리실습실 A',
    date: '06.27 (토)',
    time: '17:00',
    capacity: 4,
    count: 3,
    dday: 'D-3',
  },
  {
    id: 'app3',
    title: '7호관 공유주방 C팀',
    place: '7호관 공유주방',
    date: '06.20 (금)',
    time: '18:00',
    capacity: 4,
    count: 2,
    dday: '마감',
    canceled: true,
  },
];
