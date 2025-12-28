import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { adminKeys } from './adminKeys';
import { PaginationRequest } from '@/types/admin';

export const useAdminUsers = (params: PaginationRequest) => {
  return useQuery({
    queryKey: adminKeys.userList(params.page, params.size, params.sort),
    queryFn: async () => {
      const response = await adminService.getUserList(params);
      return response.data.data;
    },
  });
};
