import {
  checkInhaEmail,
  isLoginValid,
  isSignupEmailValid,
  isIngredientRowValid,
  isVoteValid,
} from './validators';

describe('checkInhaEmail', () => {
  it('빈 입력 → empty, 메시지 없음', () => {
    expect(checkInhaEmail('')).toEqual({ validity: 'empty', message: null });
    expect(checkInhaEmail('   ')).toEqual({ validity: 'empty', message: null });
  });
  it('@ 입력 전 → incomplete', () => {
    expect(checkInhaEmail('juhan')).toEqual({ validity: 'incomplete', message: null });
  });
  it('인하 도메인 → valid + PRD 카피', () => {
    expect(checkInhaEmail('juhan@inha.edu')).toEqual({
      validity: 'valid',
      message: '인하대 이메일이 확인됐어요',
    });
    expect(checkInhaEmail('a@inha.ac.kr').validity).toBe('valid');
  });
  it('대소문자 무시 (i 플래그)', () => {
    expect(checkInhaEmail('A@INHA.EDU').validity).toBe('valid');
  });
  it('다른 도메인 → invalidDomain + PRD 카피', () => {
    expect(checkInhaEmail('juhan@gmail.com')).toEqual({
      validity: 'invalidDomain',
      message: '@inha.ac.kr 또는 @inha.edu 만 가입할 수 있어요',
    });
  });
});

describe('isLoginValid', () => {
  it('빈 값 거부', () => {
    expect(isLoginValid('')).toBe(false);
    expect(isLoginValid('  ')).toBe(false);
  });
  it('값 있으면 통과', () => expect(isLoginValid('x')).toBe(true));
});

describe('isSignupEmailValid', () => {
  it('인하 도메인만 통과', () => {
    expect(isSignupEmailValid('a@inha.edu')).toBe(true);
    expect(isSignupEmailValid('a@gmail.com')).toBe(false);
  });
});

describe('isIngredientRowValid', () => {
  it('재료명 + 개수 모두 필수 (grams는 선택)', () => {
    expect(isIngredientRowValid('계란', '2')).toBe(true);
    expect(isIngredientRowValid('', '2')).toBe(false);
    expect(isIngredientRowValid('계란', '')).toBe(false);
    expect(isIngredientRowValid('  ', '2')).toBe(false);
  });
});

describe('isVoteValid', () => {
  it('선택이 없으면 거부', () => expect(isVoteValid(null, '')).toBe(false));
  it('일반 선택은 사유 없이 통과', () => expect(isVoteValid('A', '')).toBe(true));
  it('E(재추천)는 사유 필수', () => {
    expect(isVoteValid('E', '')).toBe(false);
    expect(isVoteValid('E', '다른 메뉴를 원해요')).toBe(true);
  });
});
