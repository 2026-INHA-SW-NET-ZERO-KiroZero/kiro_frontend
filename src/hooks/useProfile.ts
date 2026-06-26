/**
 * 프로필 편집 상태(요리 숙련도·알레르기) 공유 컨텍스트. (PRD §3.13·§3.14)
 *
 * MY 화면이 읽고 editProfile 화면이 쓰는 전역 상태라 Context로 공유한다
 * (인증의 `AuthContext`와 동일 패턴). 토글은 즉시 반영하고, editProfile의 "저장하기"는
 * `PUT /api/v1/me/profile`로 전송한 뒤 `useMe` 캐시를 갱신한다.
 *
 * 초기값은 `useMe()`(`GET /auth/me`)에서 받은 숙련도·알레르기(tag)로 동기화한다.
 * 알레르기 식별자는 tag 문자열(예: 'peanut')을 그대로 사용해 저장 시 변환이 필요 없다.
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { apiRequest } from '@/lib/apiClient';
import { SKILL_TO_SERVER } from '@/types';
import type { CurrentUserResponse, SkillLevel, UpdateProfileRequest } from '@/types';

import { useMe } from './useMe';

interface ProfileState {
  skillLevel: SkillLevel;
  /** 선택된 알레르기 tag 문자열 목록. */
  allergies: string[];
  setSkill: (level: SkillLevel) => void;
  toggleAllergy: (tag: string) => void;
  /** 프로필 저장 (`PUT /me/profile`) 후 useMe 갱신. */
  save: () => Promise<void>;
  saving: boolean;
}

export const ProfileContext = createContext<ProfileState>({
  skillLevel: '중',
  allergies: [],
  setSkill: () => {},
  toggleAllergy: () => {},
  save: async () => {},
  saving: false,
});

export function useProfileProvider(): ProfileState {
  const { data: me, refetch } = useMe();
  // 편집 전에는 draft가 null → 서버 값(me)을 그대로 노출. 편집하면 draft가 우선한다.
  // (effect로 동기화하지 않아 cascading 렌더/규칙 위반 없음. 저장 성공 시 draft를 비워 서버 값으로 복귀.)
  const [draftSkill, setDraftSkill] = useState<SkillLevel | null>(null);
  const [draftAllergies, setDraftAllergies] = useState<string[] | null>(null);
  const [saving, setSaving] = useState(false);

  const skillLevel = draftSkill ?? me?.skill ?? '중';
  const allergies = useMemo(() => draftAllergies ?? me?.allergy ?? [], [draftAllergies, me]);

  const setSkill = useCallback((level: SkillLevel) => {
    setDraftSkill(level);
  }, []);

  const toggleAllergy = useCallback(
    (tag: string) => {
      setDraftAllergies((prev) => {
        const base = prev ?? me?.allergy ?? [];
        return base.includes(tag) ? base.filter((x) => x !== tag) : [...base, tag];
      });
    },
    [me],
  );

  const save = useCallback(async () => {
    if (me === null) return;
    setSaving(true);
    try {
      const body: UpdateProfileRequest = {
        nickname: me.nickname,
        cookingSkill: SKILL_TO_SERVER[skillLevel],
        allergyTags: allergies,
      };
      await apiRequest<CurrentUserResponse>('/me/profile', { method: 'PUT', body });
      // 저장 성공 → draft 비우고 서버 값 재요청(새 값으로 동기화).
      setDraftSkill(null);
      setDraftAllergies(null);
      refetch();
    } finally {
      setSaving(false);
    }
  }, [me, skillLevel, allergies, refetch]);

  return useMemo(
    () => ({ skillLevel, allergies, setSkill, toggleAllergy, save, saving }),
    [skillLevel, allergies, setSkill, toggleAllergy, save, saving],
  );
}

export function useProfile(): ProfileState {
  return useContext(ProfileContext);
}
