const RETURN_TO_KEY = 'returnTo';

/**
 * 로그인 후 돌아갈 경로.
 *
 * 라우터 state 대신 sessionStorage를 쓰는 이유는, 소셜 로그인이 외부 페이지를 거쳐
 * 돌아오면서 페이지가 새로 로드되어 state가 사라지기 때문이다.
 */
export const saveReturnTo = (path: string) => {
  //로그인 화면 자체로 돌아오면 순환이 되므로 저장하지 않는다.
  if (!path || path.startsWith('/login')) {
    return;
  }
  sessionStorage.setItem(RETURN_TO_KEY, path);
};

/** 저장된 복귀 경로를 꺼내면서 지운다. 없으면 홈. */
export const consumeReturnTo = (fallback = '/home'): string => {
  const stored = sessionStorage.getItem(RETURN_TO_KEY);
  sessionStorage.removeItem(RETURN_TO_KEY);
  return stored || fallback;
};

export const clearReturnTo = () => {
  sessionStorage.removeItem(RETURN_TO_KEY);
};
