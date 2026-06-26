/**
 * 더미데이터 시드 — 오늘 열린 방 12개 (16:00 6개 + 18:00 6개).
 * (PRD §3.3 · §5, 값/생성 로직 출처: KiroZero.dc.html `this.rooms`)
 *
 * 참여자 아바타 색은 디자인 원본 `colors[]`와 동일한 theme `avatarPalette`에서 가져온다.
 * `r1`은 방 상태(heroStatus)를 따르는 "hero" 방.
 *
 * TODO(API): 백엔드 연동 시 `GET /rooms`로 교체. 화면은 `useRooms()`/`useRoomDetail(id)` 경유.
 */
import { avatarPalette } from '@/theme/theme';
import type { Room } from '@/types';

const teams = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
const hosts1 = ['김준호', '박서연', '이도윤', '최지우', '한예진', '정민우'];
const hosts2 = ['윤서준', '임준현', '차태훈', '한지민', '서지호', '이주한'];
const counts1 = [3, 2, 4, 1, 3, 2];
const counts2 = [2, 4, 1, 3, 2, 3];

const palette = (k: number): string => avatarPalette[k % avatarPalette.length];

export const rooms: Room[] = [
  ...teams.map(
    (t, i): Room => ({
      id: i === 0 ? 'r1' : 'r' + (i + 1),
      title: `1호관 517호 ${t}팀`,
      date: '06.26 (금)',
      time: '16:00',
      place: '1호관 517호',
      tags: ['저녁', '조리실습실'],
      capacity: 4,
      baseCount: counts1[i],
      host: hosts1[i],
      parts: Array.from({ length: counts1[i] }, (_, j) => ({
        n: hosts1[(i + j) % hosts1.length],
        c: palette(i + j),
      })),
      prev: ['🧅', '🥚', '🥬', '🌭'],
    }),
  ),
  ...teams.map(
    (t, i): Room => ({
      id: 'r' + (i + 7),
      title: `1호관 517호 ${t}팀`,
      date: '06.26 (금)',
      time: '18:00',
      place: '1호관 517호',
      tags: ['저녁', '조리실습실'],
      capacity: 4,
      baseCount: counts2[i],
      host: hosts2[i],
      parts: Array.from({ length: counts2[i] }, (_, j) => ({
        n: hosts2[(i + j) % hosts2.length],
        c: palette(i + j + 2),
      })),
      prev: ['🥚', '🥩', '🧄', '🥕'],
    }),
  ),
];
