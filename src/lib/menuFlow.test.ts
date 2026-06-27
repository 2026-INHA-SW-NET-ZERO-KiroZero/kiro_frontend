import { buildMenuVoteRequest, menuTypeLabel, toDecidedMenu } from './menuFlow';

import type { CookingGuideResponse } from '@/types/api/cookingGuide';
import type { LatestRecommendationResponse } from '@/types/session';

const latest: LatestRecommendationResponse = {
  slotId: 2,
  recommendationCount: 1,
  status: 'MENU_PROPOSED',
  selectedMenu: {
    candidateLabel: 'C',
    menuName: '두부 야채 볶음',
    menuType: 'LOW_CARBON',
  },
  candidates: [
    {
      candidateLabel: 'C',
      menuName: '두부 야채 볶음',
      menuType: 'LOW_CARBON',
      usedLeftoverIngredients: [
        {
          ingredientId: 44,
          nameKo: '두부',
          availableGrams: 300,
          plannedUseGrams: 300,
          estimatedUseRatio: 1,
        },
      ],
      commonKitItems: ['간장'],
      purchaseItems: [],
      cookingTimeMinutes: 35,
      difficulty: '중',
      recommendationReason: '두부와 채소를 소진합니다.',
      cookingOutlineSteps: ['두부 물기를 제거합니다.'],
      rolePlanSummary: ['두부 손질', '채소 손질'],
    },
  ],
};

const guide: CookingGuideResponse = {
  slotId: 2,
  menuName: '두부 야채 볶음',
  steps: [
    {
      stepOrder: 1,
      phase: 'PREP',
      title: '두부 물기 제거',
      estimatedMinutes: 6,
      instruction: '두부 300g의 물기를 제거합니다.',
      usedIngredients: [{ ingredientId: 44, nameKo: '두부', plannedUseGrams: 300 }],
      tools: ['키친타월'],
      kitItems: ['간장'],
      participantTasks: [
        {
          participantId: 10,
          nickname: '김치보관함',
          taskName: '두부 포장지 제거',
          taskPurpose: '수분을 줄이기 위해',
          taskDetail: '두부를 꺼내 물기를 제거합니다.',
          attentionPoints: ['부서지지 않게 다룹니다.'],
          displayInstruction: '수분을 줄이기 위해 두부 300g을 꺼내 물기를 제거합니다.',
          skillRequired: 'LOW',
        },
      ],
      safetyNote: null,
      completionCriteria: '두부 표면 물기가 줄어든 상태',
    },
  ],
};

describe('menuFlow', () => {
  it('백엔드 LOW_CARBON 값을 저탄소 라벨로 변환한다', () => {
    expect(menuTypeLabel('LOW_CARBON')).toBe('저탄소');
    expect(menuTypeLabel('GENERAL')).toBe('일반');
  });

  it('일반 후보 투표 요청 body를 candidateLabel과 함께 만든다', () => {
    expect(
      buildMenuVoteRequest(2, [
        {
          key: 'A',
          candidateLabel: 'A',
          name: 'A',
          type: '일반',
          desc: '',
          votes: 0,
          purchase: null,
        },
        {
          key: 'B',
          candidateLabel: 'B',
          name: 'B',
          type: '일반',
          desc: '',
          votes: 0,
          purchase: null,
        },
        {
          key: 'C',
          candidateLabel: 'C',
          name: 'C',
          type: '저탄소',
          desc: '',
          votes: 0,
          purchase: null,
        },
      ]),
    ).toEqual({ voteType: 'C', candidateLabel: 'C' });
  });

  it('재추천 요청 body에는 candidateLabel을 넣지 않는다', () => {
    expect(buildMenuVoteRequest(4, [], '너무 비슷한 메뉴가 많아요')).toEqual({
      voteType: 'E',
      reasonText: '너무 비슷한 메뉴가 많아요',
    });
  });

  it('확정 메뉴와 조리 가이드로 결과 화면 데이터를 만든다', () => {
    const decided = toDecidedMenu(latest, guide, 10);

    expect(decided?.name).toBe('두부 야채 볶음');
    expect(decided?.type).toBe('저탄소');
    expect(decided?.recipe).toEqual(['두부 물기 제거: 두부 300g의 물기를 제거합니다.']);
    expect(decided?.roles[0]).toMatchObject({
      who: '김치보관함',
      role: '두부 포장지 제거',
      isMe: true,
      steps: ['수분을 줄이기 위해 두부 300g을 꺼내 물기를 제거합니다.'],
    });
  });
});
