export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  userList: (page: number, size: number, sort?: string[]) =>
    [...adminKeys.users(), 'list', { page, size, sort }] as const,
  userStats: () => [...adminKeys.users(), 'stats'] as const,
  reports: () => [...adminKeys.all, 'reports'] as const,
  postReports: () => [...adminKeys.reports(), 'posts'] as const,
  userReports: () => [...adminKeys.reports(), 'users'] as const,
};
