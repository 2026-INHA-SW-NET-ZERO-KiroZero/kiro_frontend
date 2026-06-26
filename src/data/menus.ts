/**
 * 더미데이터 시드 — AI 추천 후보 / 투표 후보 / 확정 메뉴.
 * (PRD §3.5 · §3.9 · §5, 값 출처: KiroZero.dc.html `menuCandidates`·`voteMenus`·`decidedMenu`)
 *
 * TODO(API): 메뉴 추천/투표/확정은 백엔드 AI 결과로 교체.
 * `useMenuCandidates()`·`useVoteMenus()`·`useDecidedMenu()` 경유.
 */
import type { DecidedMenu, MenuCandidate, VoteMenu } from '@/types';

export const menuCandidates: MenuCandidate[] = [
  {
    name: '두부 채소 영양밥',
    emoji: '🍚',
    score: 95,
    time: '25분',
    diff: '아주 쉬움',
    type: '저탄소',
    co2: '0.8kg CO₂',
    desc: '남은 두부·양파·대파를 모두 넣어 밥에 비벼요. 추가 구매 없이 완성돼요.',
    needed: [
      { n: '두부', q: '1모' },
      { n: '양파', q: '2개' },
      { n: '대파', q: '3대' },
    ],
    missing: [],
  },
  {
    name: '자투리 채소 된장찌개',
    emoji: '🥘',
    score: 91,
    time: '20분',
    diff: '쉬움',
    type: '저탄소',
    co2: '0.7kg CO₂',
    desc: '자투리 채소와 두부로 끓이는 든든한 찌개. 육류 없이 탄소 배출이 적어요.',
    needed: [
      { n: '두부', q: '1모' },
      { n: '양파', q: '1개' },
      { n: '대파', q: '2대' },
      { n: '애호박', q: '½개' },
    ],
    missing: [{ n: '된장', q: '2큰술' }],
  },
  {
    name: '소시지 김치 부대찌개',
    emoji: '🍲',
    score: 85,
    time: '30분',
    diff: '쉬움',
    type: '일반',
    co2: '1.5kg CO₂',
    desc: '소시지·김치·두부를 한 번에 끓여 남은 재료를 가장 많이 소진해요.',
    needed: [
      { n: '소시지', q: '8개' },
      { n: '김치', q: '400g' },
      { n: '두부', q: '1.5모' },
      { n: '대파', q: '4대' },
      { n: '양파', q: '2개' },
    ],
    missing: [{ n: '베이컨', q: '100g' }],
  },
  {
    name: '베이컨 계란 볶음밥',
    emoji: '🍳',
    score: 80,
    time: '20분',
    diff: '아주 쉬움',
    type: '일반',
    co2: '1.2kg CO₂',
    desc: '계란과 베이컨으로 빠르게. 20분이면 4인분 완성.',
    needed: [
      { n: '계란', q: '8개' },
      { n: '김치', q: '300g' },
      { n: '양파', q: '2개' },
      { n: '대파', q: '3대' },
    ],
    missing: [{ n: '베이컨', q: '100g' }],
  },
];

export const voteMenus: VoteMenu[] = [
  {
    key: 'A',
    name: '두부 채소 영양밥',
    emoji: '🍚',
    type: '저탄소',
    desc: '남은 두부·양파·대파를 모두 넣어 밥에 비벼요. 추가 구매 없이 완성돼요.',
    votes: 1,
    co2: '0.8kg',
    purchase: null,
  },
  {
    key: 'B',
    name: '자투리 채소 된장찌개',
    emoji: '🥘',
    type: '저탄소',
    desc: '자투리 채소와 두부로 끓이는 든든한 찌개. 육류 없이 탄소 배출이 적어요.',
    votes: 0,
    co2: '0.7kg',
    purchase: null,
  },
  {
    key: 'C',
    name: '소시지 김치 부대찌개',
    emoji: '🍲',
    type: '일반',
    desc: '소시지·김치·두부를 한 번에. 남은 재료 소진율이 가장 높아요.',
    votes: 2,
    co2: '0.5kg',
    purchase: { item: '소시지 200g', buyer: '참여자 1', cost: '4,000원' },
  },
  {
    key: 'D',
    name: '베이컨 계란 볶음밥',
    emoji: '🍳',
    type: '일반',
    desc: '계란과 베이컨으로 빠르게. 20분이면 4인분 완성.',
    votes: 0,
    co2: '0.4kg',
    purchase: { item: '베이컨 100g', buyer: '참여자 1', cost: '3,500원' },
  },
];

export const decidedMenu: DecidedMenu = {
  name: '소시지 김치 부대찌개',
  emoji: '🍲',
  time: '30분',
  servings: '4인분',
  co2: '0.5kg',
  votes: '4표 중 2표',
  purchase: { item: '소시지 200g', buyer: '참여자 1', cost: '4,000원' },
  recipe: [
    '김치와 양파를 먹기 좋게 썰어 냄비 바닥에 깔아요.',
    '소시지와 두부를 올리고 물 4컵(800ml)을 부어요.',
    '고춧가루 1큰술·다진 마늘을 넣고 센 불로 끓여요.',
    '끓어오르면 대파를 넣고 중불로 5분 더 끓여 완성해요.',
  ],
  roles: [
    {
      who: '나',
      role: '김치·채소 손질',
      bring: '라면사리 1개',
      isMe: true,
      steps: [
        '김치 200g을 한입 크기로 썰고 김칫국물도 함께 준비해요.',
        '양파·대파는 어슷 썰고, 두부는 1cm 두께로 큼직하게 썰어요.',
        '라면사리는 끓기 직전 넣을 수 있게 옆에 빼 둬요.',
      ],
    },
    {
      who: '참여자 1',
      role: '육수 내고 간 맞추기',
      bring: '없음',
      isMe: false,
      steps: [
        '냄비에 물 4컵(800ml)을 붓고 다시마로 기본 육수를 잡아요.',
        '고춧가루 1큰술과 다진 마늘을 풀어 양념 베이스를 만들어요.',
        '끓는 동안 간을 보며 국간장·소금으로 맞춰요.',
      ],
    },
    {
      who: '참여자 2',
      role: '식기 세팅·서빙',
      bring: '대파 2대',
      isMe: false,
      steps: [
        '4인분 그릇과 국자·앞접시를 미리 세팅해요.',
        '완성되면 건더기와 국물을 골고루 나눠 담아요.',
        '라면사리는 1인분씩 덜어 불기 전에 빠르게 서빙해요.',
      ],
    },
    {
      who: '참여자 3',
      role: '설거지·뒷정리',
      bring: '없음',
      isMe: false,
      steps: [
        '조리 중 나온 도마·칼을 바로바로 헹궈 정리해요.',
        '식사 후 잔반을 한곳에 모아 분리배출해요.',
        '인덕션과 조리대를 닦아 다음 팀이 쓰게 정리해요.',
      ],
    },
  ],
};
