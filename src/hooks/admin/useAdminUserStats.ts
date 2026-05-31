import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { adminKeys } from './adminKeys';

export const useAdminUserStats = () => {
  return useQuery({
    queryKey: adminKeys.userStats(),
    queryFn: async () => {
      const response = await adminService.getUserStats();
      return response.data.data;
    },
  });
};
