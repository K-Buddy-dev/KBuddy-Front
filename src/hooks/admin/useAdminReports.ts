import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { adminKeys } from './adminKeys';

export const useAdminPostReports = () => {
  return useQuery({
    queryKey: adminKeys.postReports(),
    queryFn: async () => {
      const response = await adminService.getPostReports();
      return response.data.data;
    },
  });
};

export const useAdminUserReports = () => {
  return useQuery({
    queryKey: adminKeys.userReports(),
    queryFn: async () => {
      const response = await adminService.getUserReports();
      return response.data.data;
    },
  });
};
