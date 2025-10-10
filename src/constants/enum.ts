export const APP_PUSH_TYPE = {
  PUSH_NOTIFICATION: 'PUSH_NOTIFICATION',
} as const;

export const APP_PART = {
  BLOG: 'BLOG',
  QNA: 'QNA',
} as const;

export const COMMUNITY_APP_TAB = {
  [APP_PART.BLOG]: 'Userblog',
  [APP_PART.QNA]: 'Q&A',
} as const;

// 최종 라우팅 URL을 만드는 함수
export const getAppRoute = (part: keyof typeof COMMUNITY_APP_TAB, postID: string) => {
  const tab = COMMUNITY_APP_TAB[part];
  return `/community/detail/${postID}?tab=${encodeURIComponent(tab)}`;
};
