/**
 * 프로필 편집 상태(요리 숙련도·알레르기) 공유 컨텍스트. (PRD §3.13·§3.14)
 *
 * MY 화면이 읽고 editProfile 화면이 쓰는 전역 상태라 Context로 공유한다
 * (인증의 `AuthContext`와 동일 패턴). 디자인 프로토타입처럼 토글 즉시 반영하며,
 * editProfile의 "저장하기"는 화면 복귀(`router.back()`)만 한다.
 *
 * 초기값 출처: KiroZero.dc.html state(`skillLevel:'중'`, `allergies:me.allergy`).
 *
 * TODO(API): 백엔드 연동 시 `GET /api/v1/auth/me`로 초기값을 받고,
 * 저장은 `PUT /api/v1/me/profile`로 보낸다(2026-06-27 Swagger 확인, 마일스톤 3).
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { SkillLevel } from '@/types';

import { useMe } from './useMe';

interface ProfileState {
  skillLevel: SkillLevel;
  allergies: string[];
  setSkill: (level: SkillLevel) => void;
  toggleAllergy: (label: string) => void;
}

export const ProfileContext = createContext<ProfileState>({
  skillLevel: '중',
  allergies: [],
  setSkill: () => {},
  toggleAllergy: () => {},
});

export function useProfileProvider(): ProfileState {
  const { data: me } = useMe();
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('중');
  const [allergies, setAllergies] = useState<string[]>(() => [...me.allergy]);

  const setSkill = useCallback((level: SkillLevel) => {
    setSkillLevel(level);
  }, []);

  const toggleAllergy = useCallback((label: string) => {
    setAllergies((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  }, []);

  return useMemo(
    () => ({ skillLevel, allergies, setSkill, toggleAllergy }),
    [skillLevel, allergies, setSkill, toggleAllergy],
  );
}

export function useProfile(): ProfileState {
  return useContext(ProfileContext);
}
