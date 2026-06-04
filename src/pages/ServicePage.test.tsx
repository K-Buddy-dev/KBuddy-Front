import { act, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import render from '@/utils/test/render';
import { counselorService } from '@/services/counselorService';
import { ServicePage } from './ServicePage';
import { notificationService } from '@/services/notificationService';

vi.mock('@/services/counselorService', () => ({
  counselorService: {
    getCounselors: vi.fn(),
  },
}));

vi.mock('@/services/notificationService', () => ({
  notificationService: {
    getUnreadCount: vi.fn(),
  },
}));

beforeEach(() => {
  localStorage.clear();
  vi.mocked(notificationService.getUnreadCount).mockResolvedValue(0);
  vi.mocked(counselorService.getCounselors).mockResolvedValue({
    content: [
      {
        categories: ['생활', '비자'],
        counselorId: '7',
        counselorUserUuid: 'user-7',
        coverImageUrl: 'https://example.com/cover.jpg',
        hasPromotion: false,
        name: '홍길동',
        ratingAvg: 4.8,
        regularPrice: 30000,
        reviewCount: 12,
        sessionMinutes: 50,
        title: '한국 생활 전문 상담사',
      },
    ],
    totalElements: 1,
  });
});

it('renders counselors from the counselor list API', async () => {
  await render(
    <MemoryRouter initialEntries={['/service']}>
      <Routes>
        <Route path="/service" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>
  );
  await act(async () => {});

  expect(await screen.findByText('한국 생활 전문 상담사')).toBeInTheDocument();
  expect(screen.getByText('@홍길동')).toBeInTheDocument();
  expect(screen.getByText('생활 | 비자')).toBeInTheDocument();
  expect(screen.getByText('30,000 won')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  expect(counselorService.getCounselors).toHaveBeenCalledWith({ page: 0, size: 20 });
});

it('loads counselors with the category query parameter', async () => {
  await render(
    <MemoryRouter initialEntries={['/service?category=VISA_IMMIGRATION']}>
      <Routes>
        <Route path="/service" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>
  );
  await act(async () => {});

  expect(counselorService.getCounselors).toHaveBeenCalledWith({ category: 'VISA_IMMIGRATION', page: 0, size: 20 });
  expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByRole('button', { name: 'Visa' })).toHaveAttribute('aria-pressed', 'true');
});

it('clears the category filter when All is clicked', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/service?category=HEALTHCARE']}>
      <Routes>
        <Route path="/service" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>
  );
  await act(async () => {});

  await user.click(screen.getByRole('button', { name: 'All' }));

  expect(counselorService.getCounselors).toHaveBeenLastCalledWith({ page: 0, size: 20 });
  expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
});

it('updates the selected category when a service category filter is clicked', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/service']}>
      <Routes>
        <Route path="/service" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>
  );
  await act(async () => {});

  await user.click(screen.getByRole('button', { name: 'Healthcare' }));

  expect(counselorService.getCounselors).toHaveBeenLastCalledWith({ category: 'HEALTHCARE', page: 0, size: 20 });
  expect(screen.getByRole('button', { name: 'Healthcare' })).toHaveAttribute('aria-pressed', 'true');
});

it('hides the filters and KRW controls', async () => {
  await render(
    <MemoryRouter initialEntries={['/service']}>
      <Routes>
        <Route path="/service" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>
  );
  await act(async () => {});

  expect(screen.queryByRole('button', { name: /Filters/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /KRW/i })).not.toBeInTheDocument();
  expect(screen.queryByText('Filters')).not.toBeInTheDocument();
  expect(screen.queryByText('KRW')).not.toBeInTheDocument();
});

it('passes my profile ownership state when counselorUserUuid matches current user uuid', async () => {
  localStorage.setItem('basicUserData', JSON.stringify({ userId: 'legacy-id', uuid: 'user-7' }));

  const { user } = await render(
    <MemoryRouter initialEntries={['/service']}>
      <Routes>
        <Route path="/service" element={<ServicePage />} />
        <Route path="/service/:id" element={<ServiceDetailStateProbe />} />
      </Routes>
    </MemoryRouter>
  );
  await act(async () => {});

  await user.click(await screen.findByText('한국 생활 전문 상담사'));

  expect(await screen.findByText('isMyProfile:true')).toBeInTheDocument();
});

function ServiceDetailStateProbe() {
  const location = useLocation();
  const state = location.state as { isMyProfile?: boolean } | null;

  return <div>isMyProfile:{String(state?.isMyProfile)}</div>;
}
