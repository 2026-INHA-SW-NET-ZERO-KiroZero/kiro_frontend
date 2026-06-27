/**
 * 홈 카드 표시 데이터 훅 — `useRooms()`(방 12개)를 `roomDisplay()`로 매핑해
 * home.tsx가 바로 렌더할 수 있는 `HomeRoomCard` 목록으로 가공한다.
 *
 * 홈의 방은 전부 OPEN 상태로 표시한다(dc.html `roomDisplay`: 비-hero 방은 status='OPEN').
 * 좌석/카운트는 공용 `roomDisplay()` 결과를 재사용하고, 배지만 dc.html 분기를 그대로 따른다.
 * (배지 출처: KiroZero.dc.html `roomDisplay()` line 1665 — left<=0 '마감' / left<=1 '마감임박' / else 'N자리 남음')
 *
 * TODO(API): 데이터 출처는 `useRooms()`(= `GET /rooms`)이므로 백엔드 연동 시 이 훅은 변경 없이 동작.
 */
import { roomDisplay } from '@/lib';
import type { StatusBadgeKey } from '@/lib';
import type { Room } from '@/types';

import { useRooms } from './useRooms';

/** 카드 좌하단 참여자 아바타(이름 첫 글자 + 식별 색). */
export interface HomeRoomAvatar {
  /** 이름 첫 글자. */
  label: string;
  /** 아바타 배경색 (theme `avatarPalette` 값). */
  bg: string;
}

/** home.tsx가 그대로 렌더하는 방 카드 표시 모델. */
export interface HomeRoomCard {
  id: string;
  title: string;
  /** 시작 시각 (예: '16:00'). */
  time: string;
  /** 표기용 날짜 (예: '06.26 (금)'). */
  dateShort: string;
  place: string;
  stationCode?: string;
  /** 상태 배지 키 (theme `statusChip` 조회용). */
  badgeKey: StatusBadgeKey;
  /**
   * 배지 라벨 override. `seatsLeft` 키일 때만 'N자리 남음' 동적 문자열을 담는다.
   * 라벨이 토큰에 고정된 키(full='마감', almostFull='마감임박')는 `undefined`.
   */
  badgeLabel?: string;
  /** 태그를 ' · '로 이은 문자열 (예: '저녁 · 조리실습실'). */
  tagText: string;
  /** 모임 정원 표기 'N/4명'. */
  countText: string;
  /** 참여자 아바타 최대 3개. */
  parts: HomeRoomAvatar[];
}

export interface UseHomeRoomsResult {
  /** 추천 모임 — 앞 3개. */
  recRooms: HomeRoomCard[];
  /** 오늘 열린 방 — 전체. */
  openRooms: HomeRoomCard[];
  isLoading: boolean;
  isEmpty: boolean;
}

/** OPEN 방의 남은 좌석 수 → 배지 키/라벨 (dc.html `roomDisplay` 분기). */
function homeBadge(seatsLeft: number): Pick<HomeRoomCard, 'badgeKey' | 'badgeLabel'> {
  if (seatsLeft <= 0) return { badgeKey: 'full' }; // 토큰 라벨 '마감'
  if (seatsLeft <= 1) return { badgeKey: 'almostFull' }; // 토큰 라벨 '마감임박'
  return { badgeKey: 'seatsLeft', badgeLabel: `${seatsLeft}자리 남음` };
}

/** `Room` → 홈 카드 표시 모델. 홈은 전부 OPEN으로 계산한다. */
export function toHomeRoomCard(room: Room): HomeRoomCard {
  const display = roomDisplay({ state: 'OPEN', capacity: room.capacity, count: room.baseCount });
  return {
    id: room.id,
    title: room.title,
    time: room.time,
    dateShort: room.date,
    place: room.place,
    stationCode: room.stationCode,
    ...homeBadge(display.seatsLeft),
    tagText: room.tags.join(' · '),
    countText: display.seatsCount,
    parts: room.parts.slice(0, 3).map((p) => ({ label: p.n.charAt(0), bg: p.c })),
  };
}

/** 홈 화면용 방 카드 데이터. `recRooms`=앞 3개, `openRooms`=전체. */
export function useHomeRooms(date: string): UseHomeRoomsResult {
  const { data, loading, isEmpty } = useRooms(date);
  const openRooms = data.map(toHomeRoomCard);
  return {
    recRooms: openRooms.slice(0, 3),
    openRooms,
    isLoading: loading,
    isEmpty,
  };
}
