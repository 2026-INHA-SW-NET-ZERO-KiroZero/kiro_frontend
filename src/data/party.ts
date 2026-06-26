/**
 * 더미데이터 시드 — 익명화된 참여자 프로필 4종. 방/신청 참여자 카드 렌더에 순환 사용.
 * (PRD §5, 값 출처: KiroZero.dc.html `partyPool`)
 *
 * TODO(API): 실제 참여자 정보는 백엔드 방 상세 응답으로 교체. `usePartyPool()` 경유.
 */
import type { PartyProfile } from '@/types';

export const partyPool: PartyProfile[] = [
  {
    skill: '중',
    allergies: ['🥜 땅콩'],
    bring: [
      { e: '🥚', n: '계란 5개' },
      { e: '🧅', n: '양파 2개' },
    ],
    extra: true,
  },
  {
    skill: '상',
    allergies: [],
    bring: [
      { e: '🥬', n: '김치 200g' },
      { e: '🧄', n: '대파 2대' },
    ],
    extra: true,
  },
  {
    skill: '하',
    allergies: ['🦐 갑각류'],
    bring: [{ e: '🌭', n: '소시지 4개' }],
    extra: false,
  },
  {
    skill: '중',
    allergies: ['🥛 우유'],
    bring: [
      { e: '🥩', n: '돼지고기 150g' },
      { e: '🍲', n: '두부 1모' },
    ],
    extra: true,
  },
];
