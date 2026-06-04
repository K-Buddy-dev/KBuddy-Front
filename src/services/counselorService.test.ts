import { authClient } from '@/api/axiosConfig';
import { counselorService } from './counselorService';

vi.mock('@/api/axiosConfig', () => ({
  authClient: {
    get: vi.fn(),
  },
}));

it('passes category and sort params when loading counselors', async () => {
  vi.mocked(authClient.get).mockResolvedValue({
    data: {
      content: [],
      totalElements: 0,
    },
  });

  await counselorService.getCounselors({ category: 'VISA_IMMIGRATION', page: 0, size: 20, sort: 'rating' });

  expect(authClient.get).toHaveBeenCalledWith('/counselor', {
    params: {
      category: 'VISA_IMMIGRATION',
      page: 0,
      size: 20,
      sort: 'rating',
    },
  });
});
