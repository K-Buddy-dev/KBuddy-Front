export const APP_PUSH_TYPE = {
  PUSH_NOTIFICATION: 'pushNotification',
} as const;

export const APP_PART = {
  BLOG: 'blog',
  QNA: 'qna',
} as const;

export const COMMUNITY_APP_TAB = {
  [APP_PART.BLOG]: 'Userblog',
  [APP_PART.QNA]: 'Q&A',
} as const;

export const getAppRoute = (part: keyof typeof COMMUNITY_APP_TAB, postID: string) => {
  const tab = COMMUNITY_APP_TAB[part];
  return `/community/detail/${postID}?tab=${encodeURIComponent(tab)}`;
};
