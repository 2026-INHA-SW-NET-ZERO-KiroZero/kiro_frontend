/**
 * 더미데이터 시드 — 현재 사용자. (PRD §5, 값 출처: KiroZero.dc.html `this.me`)
 *
 * TODO(API): 백엔드 연동 시 이 시드를 삭제하고 `GET /me` 응답으로 교체한다.
 * 화면은 `useMe()` 훅으로만 접근하므로 훅 내부만 바꾸면 된다.
 */
import type { Me } from '@/types';

export const me: Me = {
  name: '이주한',
  dept: '인하대 컴퓨터공학과 21',
  email: 'juhan@inha.edu',
  allergy: ['땅콩', '갑각류'],
  grade: '새싹 쉐프',
  gradeLv: 2,
  cash: '2,400원',
  leaves: '240원',
};
