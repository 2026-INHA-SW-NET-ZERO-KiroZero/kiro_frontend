import { toHomeRoomCard } from './useHomeRooms';

import type { Room } from '@/types';

/** capacity 4 고정, baseCount만 바꾸는 테스트용 방 팩토리. */
function room(baseCount: number, over: Partial<Room> = {}): Room {
  return {
    id: 'r1',
    title: '1호관 517호 A팀',
    date: '06.26 (금)',
    time: '16:00',
    place: '1호관 517호',
    stationCode: '인하대역',
    tags: ['저녁', '조리실습실'],
    capacity: 4,
    baseCount,
    host: '김준호',
    parts: [
      { n: '김준호', c: '#A' },
      { n: '박서연', c: '#B' },
      { n: '이도윤', c: '#C' },
      { n: '최지우', c: '#D' },
    ],
    prev: ['🧅', '🥚'],
    ...over,
  };
}

describe('toHomeRoomCard — 배지 분기 (dc.html roomDisplay)', () => {
  it('여유(2자리 이상) → seatsLeft + 동적 라벨', () => {
    const card = toHomeRoomCard(room(2)); // left=2
    expect(card.badgeKey).toBe('seatsLeft');
    expect(card.badgeLabel).toBe('2자리 남음');
    expect(card.countText).toBe('2/4명');
  });

  it('1자리 → almostFull, 라벨 override 없음', () => {
    const card = toHomeRoomCard(room(3)); // left=1
    expect(card.badgeKey).toBe('almostFull');
    expect(card.badgeLabel).toBeUndefined();
  });

  it('마감(0자리) → full, 라벨 override 없음', () => {
    const card = toHomeRoomCard(room(4)); // left=0
    expect(card.badgeKey).toBe('full');
    expect(card.badgeLabel).toBeUndefined();
    expect(card.countText).toBe('4/4명');
  });
});

describe('toHomeRoomCard — 표시 필드', () => {
  it('tag/parts/날짜를 카드 모양으로 가공', () => {
    const card = toHomeRoomCard(room(2));
    expect(card.tagText).toBe('저녁 · 조리실습실');
    expect(card.dateShort).toBe('06.26 (금)');
    expect(card.time).toBe('16:00');
    // 아바타는 최대 3개, label은 이름 첫 글자
    expect(card.parts).toHaveLength(3);
    expect(card.parts[0]).toEqual({ label: '김', bg: '#A' });
  });
});
