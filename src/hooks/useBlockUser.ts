// hooks/useBlockUser.ts
import { blogService } from '@/services/blogService';
import { BlogFilters } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { blogQueryKeys } from './blog/blogKeys';

const buildFiltersFromSearchStrict = (searchParams: URLSearchParams): BlogFilters => {
  const filters: Partial<BlogFilters> = {};

  if (searchParams.has('size')) {
    const size = Number(searchParams.get('size'));
    if (!Number.isNaN(size)) filters.size = size;
  }
  if (searchParams.has('id')) {
    const id = Number(searchParams.get('id'));
    if (!Number.isNaN(id)) filters.id = id;
  }
  if (searchParams.has('keyword')) {
    filters.keyword = searchParams.get('keyword') ?? '';
  }
  if (searchParams.has('sort')) {
    filters.sort = searchParams.get('sort') ?? undefined;
  }
  if (searchParams.has('categoryCode')) {
    const categoryCode = Number(searchParams.get('categoryCode'));
    if (!Number.isNaN(categoryCode)) filters.categoryCode = categoryCode;
  }

  return filters as BlogFilters;
};
const buildRedirectSearch = (searchParams: URLSearchParams) => {
  // 그대로 유지한 채 조립
  const rebuilt = new URLSearchParams();
  for (const key of ['tab', 'sort', 'categoryCode', 'keyword', 'size', 'id']) {
    const val = searchParams.get(key);
    if (val !== null) rebuilt.set(key, val);
  }
  return rebuilt.toString();
};

// 유저 차단
export const useBlockUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filters: BlogFilters = buildFiltersFromSearchStrict(searchParams);

  return useMutation<void, Error, string>({
    mutationFn: (blockedUserId: string) => blogService.blockUser(blockedUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
      queryClient.invalidateQueries({
        queryKey: blogQueryKeys.blog.list(filters),
      });

      if (location.pathname.startsWith('/community/detail')) {
        const qs = buildRedirectSearch(searchParams);
        navigate(`/community${qs ? `?${qs}` : ''}`);
      }
    },
    onError: (error, blockedUserId) => {
      console.error(`Failed to block user ${blockedUserId}:`, error.message);
    },
  });
};

// 유저 차단 해제
export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (blockedUserId: string) => blogService.unblockUser(blockedUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
    },
    onError: (error, blockedUserId) => {
      console.error(`Failed to unblock user ${blockedUserId}:`, error.message);
    },
  });
};

// 차단된 유저 목록 조회
export const useBlockedUsers = () => {
  return useQuery({
    queryKey: ['blockedUsers'],
    queryFn: blogService.getBlockedUsers,
    staleTime: 1000 * 60, // 1분 캐싱
  });
};
