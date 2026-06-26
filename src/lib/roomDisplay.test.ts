import { roomDisplay } from './roomDisplay';

describe('roomDisplay — OPEN', () => {
  it('여유 있으면 모집중 + 참여 CTA', () => {
    const d = roomDisplay({ state: 'OPEN', capacity: 4, count: 2 });
    expect(d.seatsLeft).toBe(2);
    expect(d.seatsCount).toBe('2/4명');
    expect(d.seatsText).toBe('2자리 남음');
    expect(d.badge).toBe('open');
    expect(d.cta).toEqual({
      label: '이 모임 참여하기',
      action: 'join',
      disabled: false,
      variant: 'primary',
    });
  });

  it('seatsLeft≤1 → 마감임박', () => {
    const d = roomDisplay({ state: 'OPEN', capacity: 4, count: 3 });
    expect(d.seatsLeft).toBe(1);
    expect(d.badge).toBe('almostFull');
    expect(d.seatsText).toBe('1자리 남음');
  });

  it('seatsLeft≤0 → 마감, CTA 비활성', () => {
    const d = roomDisplay({ state: 'OPEN', capacity: 4, count: 4 });
    expect(d.seatsLeft).toBe(0);
    expect(d.badge).toBe('full');
    expect(d.seatsText).toBe('마감');
    expect(d.cta).toEqual({ label: '마감', action: null, disabled: true, variant: 'grey' });
  });

  it('정원 초과는 0으로 클램프', () => {
    const d = roomDisplay({ state: 'OPEN', capacity: 4, count: 5 });
    expect(d.seatsLeft).toBe(0);
    expect(d.badge).toBe('full');
  });

  it('참여 중이면 신청 취소 (정원 무관)', () => {
    const d = roomDisplay({ state: 'OPEN', capacity: 4, count: 2, joined: true });
    expect(d.cta).toEqual({
      label: '신청 취소',
      action: 'cancel',
      disabled: false,
      variant: 'grey',
    });
  });
});

describe('roomDisplay — CONFIRMED', () => {
  it('메뉴 없으면 추천 CTA', () => {
    const d = roomDisplay({ state: 'CONFIRMED', capacity: 4, count: 4 });
    expect(d.badge).toBe('confirmed');
    expect(d.cta).toEqual({
      label: 'AI 메뉴 추천 받기',
      action: 'recommend',
      disabled: false,
      variant: 'primary',
    });
  });

  it('메뉴 있으면 조리 완료 기록 CTA', () => {
    const d = roomDisplay({ state: 'CONFIRMED', capacity: 4, count: 4, hasMenu: true });
    expect(d.cta).toEqual({
      label: '조리 완료 기록하기',
      action: 'usage',
      disabled: false,
      variant: 'primary',
    });
  });
});

describe('roomDisplay — COOKED / canceled', () => {
  it('COOKED → 정산 CTA', () => {
    const d = roomDisplay({ state: 'COOKED', capacity: 4, count: 4 });
    expect(d.badge).toBe('cooked');
    expect(d.cta).toEqual({
      label: '정산 확인하기',
      action: 'settlement',
      disabled: false,
      variant: 'primary',
    });
  });

  it('취소된 방은 canceled 배지', () => {
    const d = roomDisplay({ state: 'OPEN', capacity: 4, count: 1, canceled: true });
    expect(d.badge).toBe('canceled');
  });
});
