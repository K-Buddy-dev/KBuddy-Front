import { beforeEach, describe, expect, it } from 'vitest';
import { clearReturnTo, consumeReturnTo, saveReturnTo } from './returnTo';

beforeEach(() => {
  sessionStorage.clear();
});

describe('로그인 후 복귀 경로', () => {
  it('저장한 경로를 한 번만 돌려주고 지운다', () => {
    saveReturnTo('/community/detail/1?tab=Blog');

    expect(consumeReturnTo()).toBe('/community/detail/1?tab=Blog');
    expect(consumeReturnTo()).toBe('/home');
  });

  it('저장된 경로가 없으면 홈으로 보낸다', () => {
    expect(consumeReturnTo()).toBe('/home');
  });

  /** 로그인 화면으로 돌아가면 로그인 → 로그인 순환이 된다. */
  it('로그인 화면은 복귀 대상으로 저장하지 않는다', () => {
    saveReturnTo('/login');

    expect(consumeReturnTo()).toBe('/home');
  });

  it('명시적으로 비울 수 있다', () => {
    saveReturnTo('/profile');
    clearReturnTo();

    expect(consumeReturnTo()).toBe('/home');
  });
});
