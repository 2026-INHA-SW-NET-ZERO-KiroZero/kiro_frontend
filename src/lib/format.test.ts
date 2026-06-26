import { formatWon } from './format';

describe('formatWon', () => {
  it('0원', () => expect(formatWon(0)).toBe('0원'));
  it('천 단위 콤마', () => expect(formatWon(2400)).toBe('2,400원'));
  it('백만 단위 콤마', () => expect(formatWon(1234567)).toBe('1,234,567원'));
});
