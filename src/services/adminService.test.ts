import { adminClient } from '@/api/axiosConfig';
import { adminService } from './adminService';

vi.mock('@/api/axiosConfig', () => ({
  adminClient: {
    post: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

it('sends a free notification to all users from admin', async () => {
  vi.mocked(adminClient.post).mockResolvedValue({
    data: {
      sentCount: 42,
    },
  });

  const result = await adminService.sendNotification({
    message: 'Check out our latest update!',
    targetId: '/service',
    title: 'New Feature Available',
  });

  expect(adminClient.post).toHaveBeenCalledWith('/admin/notifications', {
    message: 'Check out our latest update!',
    targetId: '/service',
    title: 'New Feature Available',
  });
  expect(result).toEqual({ sentCount: 42 });
});
