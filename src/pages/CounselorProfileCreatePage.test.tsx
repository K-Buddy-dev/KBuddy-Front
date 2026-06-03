import { screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import render from '@/utils/test/render';
import { counselorService } from '@/services/counselorService';
import { CounselorProfileCreatePage } from './CounselorProfileCreatePage';

const navigateMock = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@/services/counselorService', () => ({
  counselorService: {
    getCounselorAvailability: vi.fn(),
    getCounselorDetail: vi.fn(),
    getMyProfile: vi.fn(),
    registerProfile: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  navigateMock.mockReset();
});

function useStableCalendarDate() {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date('2026-05-20T09:00:00+09:00'));
}

it('renders the first counselor listing creation step', async () => {
  await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  expect(screen.getByText('Basic info')).toBeInTheDocument();
  expect(screen.getByText('Let’s add your cover image first.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add profile photo' })).toBeInTheDocument();
  expect(screen.getByLabelText('Title of listing')).toBeInTheDocument();
  expect(screen.getByLabelText('Detail')).toBeInTheDocument();
  expect(screen.getByLabelText('Professional Background')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add file of proof' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add photo' })).toBeInTheDocument();
});

it('loads existing counselor content when opened in edit mode', async () => {
  const slotStart = new Date(2026, 5, 1, 10, 0, 0);
  const slotDateLabel = `${slotStart.toLocaleString('en-US', { month: 'long' })} ${slotStart.getDate()}, ${slotStart.getFullYear()}`;
  const slotTimeLabel = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
    minute: '2-digit',
  }).format(slotStart);

  vi.mocked(counselorService.getCounselorDetail).mockResolvedValue({
    categories: ['RESTAURANT', 'CAFE_DESSERT'],
    counselorId: 'seller-uuid',
    coverImageUrl: 'https://example.com/existing-cover.jpg',
    detail: 'Existing live chat detail.',
    id: 'seller-uuid',
    intro: 'Existing intro',
    name: 'Seller',
    photoUrls: ['https://example.com/place-1.jpg', 'https://example.com/place-2.jpg'],
    professionalBackground: 'Existing professional background.',
    profileImageUrl: 'https://example.com/profile.jpg',
    promotion: {
      active: true,
      endDate: '2026-06-30',
      promotionalPrice: 20000,
      promotionSessionMinutes: 30,
      startDate: '2026-06-01',
    },
    proofFileUrl: 'https://example.com/files/license.pdf?signature=abc',
    ratingAvg: 4.8,
    recentReviews: [],
    regularPrice: 30000,
    reviewCount: 12,
    sessionMinutes: 50,
    timezone: 'Asia/Seoul',
    title: 'Existing counselor title',
  });
  vi.mocked(counselorService.getCounselorAvailability).mockResolvedValue({
    slots: [
      {
        availabilityId: 10,
        slotStartUtc: slotStart.toISOString(),
        status: 'AVAILABLE',
      },
      {
        availabilityId: 11,
        slotStartUtc: new Date(2026, 5, 1, 11, 0, 0).toISOString(),
        status: 'BOOKED',
      },
    ],
  });

  const { user } = await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/profile/counselor/create',
          state: { counselorId: 'seller-uuid', mode: 'edit' },
        },
      ]}
    >
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  expect(await screen.findByDisplayValue('Existing counselor title')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Existing live chat detail.')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Existing professional background.')).toBeInTheDocument();
  expect(screen.getByAltText('Cover preview')).toHaveAttribute('src', 'https://example.com/existing-cover.jpg');
  expect(screen.getByText('license.pdf')).toBeInTheDocument();
  expect(screen.getByAltText('Additional photo 1')).toHaveAttribute('src', 'https://example.com/place-1.jpg');

  await user.click(screen.getByRole('button', { name: 'Next' }));

  expect(screen.getByLabelText('Price')).toHaveValue('30,000');
  expect(screen.getByLabelText('Session minutes')).toHaveValue('50');
  expect(screen.getByLabelText('Promotional price')).toHaveValue('20,000');
  expect(screen.getByLabelText('Amount of time')).toHaveValue('30');
  expect(screen.getByLabelText('Start date')).toHaveValue('06/01/2026');
  expect(screen.getByLabelText('End date')).toHaveValue('06/30/2026');
  expect(screen.getByText('1 date, 1 time slot selected. Open calendar to review or edit.')).toBeInTheDocument();
  expect(screen.queryByText(`${slotDateLabel} - ${slotDateLabel} · ${slotTimeLabel}`)).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Add date & time' }));

  expect(screen.getByText(slotDateLabel)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: String(slotStart.getDate()) })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: slotTimeLabel })).toHaveAttribute('aria-pressed', 'true');

  await user.click(screen.getByLabelText('Close add date and time'));
  await user.click(screen.getByRole('button', { name: 'Next' }));

  expect(screen.getByLabelText('Restaurant')).toBeChecked();
  expect(screen.getByLabelText('Cafe/Dessert')).toBeChecked();
});

it('keeps multiple editable availability times even when availability ids are missing', async () => {
  const firstSlotStart = new Date(2026, 5, 1, 10, 0, 0);
  const secondSlotStart = new Date(2026, 5, 1, 12, 30, 0);
  const slotDateLabel = `${firstSlotStart.toLocaleString('en-US', { month: 'long' })} ${firstSlotStart.getDate()}, ${firstSlotStart.getFullYear()}`;
  const firstSlotTimeLabel = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
    minute: '2-digit',
  }).format(firstSlotStart);
  const secondSlotTimeLabel = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
    minute: '2-digit',
  }).format(secondSlotStart);

  vi.mocked(counselorService.getCounselorDetail).mockResolvedValue({
    categories: ['RESTAURANT'],
    counselorId: 'seller-uuid',
    detail: 'Existing live chat detail.',
    id: 'seller-uuid',
    name: 'Seller',
    recentReviews: [],
    regularPrice: 30000,
    reviewCount: 12,
    sessionMinutes: 50,
    timezone: 'Asia/Seoul',
    title: 'Existing counselor title',
  });
  vi.mocked(counselorService.getCounselorAvailability).mockResolvedValue({
    slots: [
      {
        slotStartUtc: firstSlotStart.toISOString(),
        status: 'AVAILABLE',
      },
      {
        slotStartUtc: secondSlotStart.toISOString(),
        status: 'AVAILABLE',
      },
    ] as any,
  });

  const { user } = await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/profile/counselor/create',
          state: { counselorId: 'seller-uuid', mode: 'edit' },
        },
      ]}
    >
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  expect(await screen.findByDisplayValue('Existing counselor title')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Next' }));

  expect(screen.getByText('1 date, 2 time slots selected. Open calendar to review or edit.')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Add date & time' }));

  expect(screen.getByText(slotDateLabel)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: firstSlotTimeLabel })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: secondSlotTimeLabel })).toHaveAttribute('aria-pressed', 'true');
});

it('treats timezone-less slotStartUtc values as UTC when restoring editable availability times', async () => {
  const firstSlotTimeLabel = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
    minute: '2-digit',
  }).format(new Date('2026-05-27T03:00:00Z'));
  const secondSlotTimeLabel = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
    minute: '2-digit',
  }).format(new Date('2026-05-27T06:30:00Z'));
  const thirdSlotTimeLabel = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
    minute: '2-digit',
  }).format(new Date('2026-05-27T12:30:00Z'));

  vi.mocked(counselorService.getCounselorDetail).mockResolvedValue({
    categories: ['RESTAURANT'],
    counselorId: 'seller-uuid',
    detail: 'Existing live chat detail.',
    id: 'seller-uuid',
    name: 'Seller',
    recentReviews: [],
    regularPrice: 30000,
    reviewCount: 12,
    sessionMinutes: 50,
    timezone: 'Asia/Seoul',
    title: 'Existing counselor title',
  });
  vi.mocked(counselorService.getCounselorAvailability).mockResolvedValue({
    slots: [
      {
        availabilityId: 1,
        slotStartUtc: '2026-05-27T03:00:00',
        status: 'AVAILABLE',
      },
      {
        availabilityId: 2,
        slotStartUtc: '2026-05-27T06:30:00',
        status: 'AVAILABLE',
      },
      {
        availabilityId: 3,
        slotStartUtc: '2026-05-27T12:30:00',
        status: 'AVAILABLE',
      },
    ],
  });

  const { user } = await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/profile/counselor/create',
          state: { counselorId: 'seller-uuid', mode: 'edit' },
        },
      ]}
    >
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  expect(await screen.findByDisplayValue('Existing counselor title')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Add date & time' }));

  expect(screen.getByRole('button', { name: firstSlotTimeLabel })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: secondSlotTimeLabel })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: thirdSlotTimeLabel })).toHaveAttribute('aria-pressed', 'true');
});

it('updates the cover preview after selecting a profile photo', async () => {
  const createObjectURL = vi.fn(() => 'blob:profile-photo-preview');
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: createObjectURL,
  });

  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  const file = new File(['profile photo'], 'profile.png', { type: 'image/png' });
  await user.upload(screen.getByLabelText('Add profile photo'), file);

  expect(screen.getByAltText('Cover preview')).toHaveAttribute('src', 'blob:profile-photo-preview');
});

it('shows selected proof files and allows removing them', async () => {
  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  const firstFile = new File(['proof'], 'license.pdf', { type: 'application/pdf' });
  const secondFile = new File(['proof'], 'certificate.jpg', { type: 'image/jpeg' });
  await user.upload(screen.getByLabelText('Add file of proof'), [firstFile, secondFile]);

  expect(screen.getByText('license.pdf')).toBeInTheDocument();
  expect(screen.getByText('certificate.jpg')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Remove license.pdf' }));

  expect(screen.queryByText('license.pdf')).not.toBeInTheDocument();
  expect(screen.getByText('certificate.jpg')).toBeInTheDocument();
});

it('shows selected additional photos in a gallery', async () => {
  const createObjectURL = vi
    .fn()
    .mockReturnValueOnce('blob:first-additional-photo')
    .mockReturnValueOnce('blob:second-additional-photo');
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: createObjectURL,
  });

  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  const firstFile = new File(['additional photo'], 'studio.png', { type: 'image/png' });
  const secondFile = new File(['additional photo'], 'tower.png', { type: 'image/png' });
  await user.upload(screen.getByLabelText('Add photo'), [firstFile, secondFile]);

  expect(screen.getByAltText('Additional photo 1')).toHaveAttribute('src', 'blob:first-additional-photo');
  expect(screen.getByText('1/2')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Edit photo(s)' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Next photo' }));

  expect(screen.getByAltText('Additional photo 2')).toHaveAttribute('src', 'blob:second-additional-photo');
  expect(screen.getByText('2/2')).toBeInTheDocument();
});

it('allows editing additional photos by reordering and removing them', async () => {
  const createObjectURL = vi
    .fn()
    .mockReturnValueOnce('blob:first-additional-photo')
    .mockReturnValueOnce('blob:second-additional-photo')
    .mockReturnValueOnce('blob:third-additional-photo');
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: createObjectURL,
  });

  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  const firstFile = new File(['additional photo'], 'studio.png', { type: 'image/png' });
  const secondFile = new File(['additional photo'], 'tower.png', { type: 'image/png' });
  const thirdFile = new File(['additional photo'], 'street.png', { type: 'image/png' });
  await user.upload(screen.getByLabelText('Add photo'), [firstFile, secondFile, thirdFile]);

  await user.click(screen.getByRole('button', { name: 'Edit photo(s)' }));
  await user.click(screen.getByRole('button', { name: 'Move photo 1 right' }));

  expect(screen.getByAltText('Additional photo 1')).toHaveAttribute('src', 'blob:second-additional-photo');

  await user.click(screen.getByRole('button', { name: 'Remove photo 1' }));

  expect(screen.getByAltText('Additional photo 1')).toHaveAttribute('src', 'blob:first-additional-photo');
  expect(screen.getByText('1/2')).toBeInTheDocument();
});

it('renders the service details step after clicking next', async () => {
  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));

  expect(screen.getByText('Details of service')).toBeInTheDocument();
  expect(screen.getByText('Add availability for your service.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add date & time' })).toBeInTheDocument();
  expect(screen.getByText('Add price for your service.')).toBeInTheDocument();
  expect(screen.getByLabelText('Price')).toBeInTheDocument();
  expect(screen.getByLabelText('Session minutes')).toBeInTheDocument();
  expect(screen.getByLabelText('Promotional price')).toBeInTheDocument();
  expect(screen.getByLabelText('Amount of time')).toBeInTheDocument();
  expect(screen.getByLabelText('Start date')).toBeInTheDocument();
  expect(screen.getByLabelText('End date')).toBeInTheDocument();
});

it('renders the review and submit step after clicking next from service details', async () => {
  const today = new Date();
  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Add date & time' }));
  await user.click(screen.getByRole('button', { name: String(today.getDate()) }));
  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.click(screen.getByRole('button', { name: 'Add' }));
  await user.type(screen.getByLabelText('Price'), '25000');
  await user.click(screen.getByRole('button', { name: 'Next' }));

  expect(screen.getByText('Review & submit')).toBeInTheDocument();
  expect(screen.getByText('Sale listing preview')).toBeInTheDocument();
  expect(screen.getByText('Select all categories')).toBeInTheDocument();
  expect(screen.getByLabelText('Restaurant')).toBeInTheDocument();
  expect(screen.getByText('Listing detail')).toBeInTheDocument();
  expect(screen.getByText('Available hours')).toBeInTheDocument();
  expect(screen.getByText('Service price')).toBeInTheDocument();
  expect(screen.getByText('25,000 won per 15 minutes')).toBeInTheDocument();
  expect(screen.queryByAltText(/Review photo/)).not.toBeInTheDocument();
  expect(screen.getByText('Submit is disabled because:')).toBeInTheDocument();
  expect(screen.getByText('Select at least one category.')).toBeInTheDocument();
  expect(screen.getByText('Enter session minutes of at least 15.')).toBeInTheDocument();
});

it('does not allow moving past service details without availability and regular price', async () => {
  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));

  const nextButton = screen.getByRole('button', { name: 'Next' });
  expect(nextButton).toBeDisabled();
  expect(screen.getByText('Add at least one available date and time.')).toBeInTheDocument();
  expect(screen.getByText('Enter a regular price.')).toBeInTheDocument();
});

it('shows entered content in review and supports editing previous steps', async () => {
  const today = new Date();
  const createObjectURL = vi
    .fn()
    .mockReturnValueOnce('blob:custom-cover')
    .mockReturnValueOnce('blob:custom-additional-photo');
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: createObjectURL,
  });

  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.clear(screen.getByLabelText('Title of listing'));
  await user.type(screen.getByLabelText('Title of listing'), 'Custom live chat title');
  await user.clear(screen.getByLabelText('Detail'));
  await user.type(screen.getByLabelText('Detail'), 'Custom live chat detail');
  await user.clear(screen.getByLabelText('Professional Background'));
  await user.type(screen.getByLabelText('Professional Background'), 'Custom professional background');
  await user.upload(
    screen.getByLabelText('Add profile photo'),
    new File(['cover'], 'cover.png', { type: 'image/png' })
  );
  await user.upload(
    screen.getByLabelText('Add file of proof'),
    new File(['proof'], 'proof.pdf', { type: 'application/pdf' })
  );
  await user.upload(screen.getByLabelText('Add photo'), new File(['additional'], 'place.png', { type: 'image/png' }));

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Add date & time' }));
  await user.click(screen.getByRole('button', { name: String(today.getDate()) }));
  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.click(screen.getByRole('button', { name: 'Add' }));
  await user.type(screen.getByLabelText('Price'), '25000');
  await user.type(screen.getByLabelText('Session minutes'), '45min');
  await user.type(screen.getByLabelText('Promotional price'), '15000');
  await user.type(screen.getByLabelText('Amount of time'), '30');
  await user.type(screen.getByLabelText('Start date'), '01012026');
  await user.type(screen.getByLabelText('End date'), '01312026');
  await user.click(screen.getByRole('button', { name: 'Next' }));

  expect(screen.getByAltText('Sale listing preview cover')).toHaveAttribute('src', 'blob:custom-cover');
  expect(screen.getAllByText('Custom live chat title').length).toBeGreaterThan(0);
  expect(screen.getByText('Custom live chat detail')).toBeInTheDocument();
  expect(screen.getByText('Custom professional background')).toBeInTheDocument();
  expect(screen.getByText('proof.pdf')).toBeInTheDocument();
  expect(screen.getByAltText('Review photo 1')).toHaveAttribute('src', 'blob:custom-additional-photo');
  expect(screen.getByText('25,000 won per 45 minutes')).toBeInTheDocument();
  expect(screen.getByText(/15,000 won per 30 minutes/)).toBeInTheDocument();
  expect(screen.getByText(/Duration: 01\/01\/2026 - 01\/31\/2026/)).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Edit listing detail' }));
  expect(screen.getByLabelText('Title of listing')).toHaveValue('Custom live chat title');

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Edit service price' }));
  expect(screen.getByLabelText('Price')).toHaveValue('25,000');
  expect(screen.getByLabelText('Session minutes')).toHaveValue('45');
});

it('submits counselor profile multipart data with slots grouped by date', async () => {
  useStableCalendarDate();
  vi.mocked(counselorService.registerProfile).mockResolvedValue(99);
  const createObjectURL = vi.fn().mockReturnValueOnce('blob:cover').mockReturnValueOnce('blob:photo');
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: createObjectURL,
  });

  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const expectedStartDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const expectedEndDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  const coverFile = new File(['cover'], 'cover.png', { type: 'image/png' });
  const proofFile = new File(['proof'], 'proof.pdf', { type: 'application/pdf' });
  const photoFile = new File(['photo'], 'photo.png', { type: 'image/png' });

  await user.upload(screen.getByLabelText('Add profile photo'), coverFile);
  await user.upload(screen.getByLabelText('Add file of proof'), proofFile);
  await user.upload(screen.getByLabelText('Add photo'), photoFile);
  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Add date & time' }));
  await user.click(screen.getByRole('button', { name: String(today.getDate()) }));
  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.click(screen.getByRole('button', { name: String(tomorrow.getDate()) }));
  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.click(screen.getByRole('button', { name: 'Add' }));
  await user.type(screen.getByLabelText('Price'), '25000');
  await user.type(screen.getByLabelText('Session minutes'), '45');
  await user.type(screen.getByLabelText('Promotional price'), '15000');
  await user.type(screen.getByLabelText('Amount of time'), '30');
  await user.type(screen.getByLabelText('Start date'), '01012026');
  await user.type(screen.getByLabelText('End date'), '01312026');
  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByLabelText('Restaurant'));

  const submitButton = screen.getByRole('button', { name: 'Submit' });
  expect(submitButton).toBeEnabled();

  await user.click(submitButton);

  const formData = vi.mocked(counselorService.registerProfile).mock.calls[0][0] as FormData;
  expect(formData.get('coverImage')).toBe(coverFile);
  expect(formData.get('proofFile')).toBe(proofFile);
  expect(formData.get('proofFiles')).toBeNull();
  expect(formData.getAll('photos')).toEqual([photoFile]);
  expect(formData.get('request')).toBeNull();
  expect((formData.get('data') as File).type).toBe('application/json');
  const data = JSON.parse(await readBlobText(formData.get('data') as Blob));
  expect(data.slots).toEqual([
    { date: expectedStartDate, times: ['10:00'] },
    { date: expectedEndDate, times: ['10:00'] },
  ]);
  expect(navigateMock).toHaveBeenCalledWith('/service/99', {
    replace: true,
    state: { backTo: '/profile?tab=My%20sale' },
  });
});

it('loads my counselor profile and redirects when create response has no counselor id', async () => {
  useStableCalendarDate();
  vi.mocked(counselorService.registerProfile).mockResolvedValue(null as never);
  vi.mocked(counselorService.getMyProfile).mockResolvedValue({
    categories: ['RESTAURANT'],
    counselorId: 'created-counselor',
    coverImageUrl: 'https://example.com/cover.jpg',
    detail: 'Created detail',
    id: 'created-counselor',
    name: 'Created counselor',
    photoUrls: [],
    ratingAvg: 0,
    recentInquiries: [],
    recentReviews: [],
    regularPrice: 25000,
    reviewCount: 0,
    sessionMinutes: 45,
    timezone: 'Asia/Seoul',
    title: 'Created title',
  });

  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Add date & time' }));
  await user.click(screen.getByRole('button', { name: '20' }));
  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.click(screen.getByRole('button', { name: 'Add' }));
  await user.type(screen.getByLabelText('Price'), '25000');
  await user.type(screen.getByLabelText('Session minutes'), '45');
  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByLabelText('Restaurant'));
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  expect(counselorService.getMyProfile).toHaveBeenCalledTimes(1);
  expect(navigateMock).toHaveBeenCalledWith('/service/created-counselor', {
    replace: true,
    state: { backTo: '/profile?tab=My%20sale' },
  });
});

it('preserves different selected times for each availability date', async () => {
  useStableCalendarDate();
  vi.mocked(counselorService.registerProfile).mockResolvedValue(99);
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const expectedStartDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const expectedEndDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Add date & time' }));
  await user.click(screen.getByRole('button', { name: String(today.getDate()) }));
  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.click(screen.getByRole('button', { name: String(tomorrow.getDate()) }));
  await user.click(screen.getByRole('button', { name: '3:30 PM' }));
  await user.click(screen.getByRole('button', { name: String(today.getDate()) }));

  expect(screen.getByRole('button', { name: '10:00 AM' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: '3:30 PM' })).toHaveAttribute('aria-pressed', 'false');

  await user.click(screen.getByRole('button', { name: String(tomorrow.getDate()) }));

  expect(screen.getByRole('button', { name: '10:00 AM' })).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByRole('button', { name: '3:30 PM' })).toHaveAttribute('aria-pressed', 'true');

  await user.click(screen.getByRole('button', { name: 'Add' }));
  await user.type(screen.getByLabelText('Price'), '25000');
  await user.type(screen.getByLabelText('Session minutes'), '45');
  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByLabelText('Restaurant'));
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  const formData = vi.mocked(counselorService.registerProfile).mock.calls[0][0] as FormData;
  const data = JSON.parse(await readBlobText(formData.get('data') as Blob));
  expect(data.slots).toEqual([
    { date: expectedStartDate, times: ['10:00'] },
    { date: expectedEndDate, times: ['15:30'] },
  ]);
});

it('applies a time to a date range and preserves a single-date exception time', async () => {
  useStableCalendarDate();
  vi.mocked(counselorService.registerProfile).mockResolvedValue(99);
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const expectedStartDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const expectedEndDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Add date & time' }));
  await user.click(screen.getByRole('button', { name: 'Date range' }));
  await user.click(screen.getByRole('button', { name: String(today.getDate()) }));
  await user.click(screen.getByRole('button', { name: String(tomorrow.getDate()) }));
  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.click(screen.getByRole('button', { name: 'Apply to range' }));

  expect(screen.getByText('2 dates, 2 time slots selected. Open calendar to review or edit.')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Add date & time' }));
  await user.click(screen.getByRole('button', { name: 'Single date' }));
  await user.click(screen.getByRole('button', { name: String(tomorrow.getDate()) }));
  await user.click(screen.getByRole('button', { name: '3:30 PM' }));
  await user.click(screen.getByRole('button', { name: 'Add' }));
  await user.type(screen.getByLabelText('Price'), '25000');
  await user.type(screen.getByLabelText('Session minutes'), '45');
  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByLabelText('Restaurant'));
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  const formData = vi.mocked(counselorService.registerProfile).mock.calls[0][0] as FormData;
  const data = JSON.parse(await readBlobText(formData.get('data') as Blob));
  expect(data.slots).toEqual([
    { date: expectedStartDate, times: ['10:00'] },
    { date: expectedEndDate, times: ['10:00', '15:30'] },
  ]);
});

it('shares draft selections when switching between single-date and date-range modes', async () => {
  useStableCalendarDate();
  vi.mocked(counselorService.registerProfile).mockResolvedValue(99);
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Add date & time' }));
  await user.click(screen.getByRole('button', { name: 'Date range' }));
  await user.click(screen.getByRole('button', { name: String(today.getDate()) }));
  await user.click(screen.getByRole('button', { name: String(tomorrow.getDate()) }));
  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.click(screen.getByRole('button', { name: 'Single date' }));
  await user.click(screen.getByRole('button', { name: String(tomorrow.getDate()) }));

  expect(screen.getByRole('button', { name: '10:00 AM' })).toHaveAttribute('aria-pressed', 'true');

  await user.click(screen.getByRole('button', { name: '3:30 PM' }));
  await user.click(screen.getByRole('button', { name: 'Date range' }));
  await user.click(screen.getByRole('button', { name: String(tomorrow.getDate()) }));

  expect(screen.getByRole('button', { name: '10:00 AM' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: '3:30 PM' })).toHaveAttribute('aria-pressed', 'true');
});

it('updates counselor profile with PATCH in edit mode instead of creating a new profile', async () => {
  vi.mocked(counselorService.getCounselorDetail).mockResolvedValue({
    categories: ['RESTAURANT'],
    counselorId: 'seller-uuid',
    coverImageUrl: 'https://example.com/existing-cover.jpg',
    detail: 'Existing live chat detail.',
    id: 'seller-uuid',
    intro: '',
    name: 'Seller',
    photoUrls: [],
    professionalBackground: 'Existing professional background.',
    profileImageUrl: 'https://example.com/profile.jpg',
    recentReviews: [],
    regularPrice: 30000,
    reviewCount: 12,
    sessionMinutes: 50,
    timezone: 'Asia/Seoul',
    title: 'Existing counselor title',
  });
  vi.mocked(counselorService.getCounselorAvailability).mockResolvedValue({
    slots: [
      {
        availabilityId: 10,
        slotStartUtc: new Date().toISOString(),
        status: 'AVAILABLE',
      },
    ],
  });
  vi.mocked(counselorService.updateProfile).mockResolvedValue();

  const { user } = await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/profile/counselor/create',
          state: { counselorId: 'seller-uuid', mode: 'edit' },
        },
      ]}
    >
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  expect(await screen.findByDisplayValue('Existing counselor title')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Next' }));

  const submitButton = screen.getByRole('button', { name: 'Submit' });
  expect(submitButton).toBeEnabled();

  await user.click(submitButton);

  expect(counselorService.updateProfile).toHaveBeenCalledTimes(1);
  expect(counselorService.updateProfile).toHaveBeenCalledWith(expect.any(FormData));
  const formData = vi.mocked(counselorService.updateProfile).mock.calls[0][0] as FormData;
  const data = JSON.parse(await readBlobText(formData.get('data') as Blob));
  expect(data.slots).toBeUndefined();
  expect(counselorService.registerProfile).not.toHaveBeenCalled();
  expect(navigateMock).toHaveBeenCalledWith('/profile');
});

it('allows only numeric characters and formats numeric inputs with separators', async () => {
  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));

  await user.type(screen.getByLabelText('Price'), '12a,300won');
  await user.type(screen.getByLabelText('Session minutes'), '45min');
  await user.type(screen.getByLabelText('Promotional price'), '9b900');
  await user.type(screen.getByLabelText('Amount of time'), '30min');

  expect(screen.getByLabelText('Price')).toHaveValue('12,300');
  expect(screen.getByLabelText('Session minutes')).toHaveValue('45');
  expect(screen.getByLabelText('Promotional price')).toHaveValue('9,900');
  expect(screen.getByLabelText('Amount of time')).toHaveValue('30');
});

it('formats promotion duration dates from numeric input', async () => {
  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));

  await user.type(screen.getByLabelText('Start date'), '01012026');
  await user.type(screen.getByLabelText('End date'), '12a312026');

  expect(screen.getByLabelText('Start date')).toHaveValue('01/01/2026');
  expect(screen.getByLabelText('End date')).toHaveValue('12/31/2026');
});

it('shows an inline duration date error while editing promotion dates', async () => {
  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.type(screen.getByLabelText('Start date'), '22112025');

  expect(screen.getByText('Enter promotion dates as valid MM/DD/YYYY dates.')).toBeInTheDocument();
});

it('shows an inline duration order error when promotion start date is after end date', async () => {
  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.type(screen.getByLabelText('Start date'), '02012026');
  await user.type(screen.getByLabelText('End date'), '01012026');

  expect(screen.getByText('Promotion start date must be before or same as end date.')).toBeInTheDocument();
});

it('blocks submit when promotion duration dates are invalid', async () => {
  useStableCalendarDate();
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Add date & time' }));
  await user.click(screen.getByRole('button', { name: String(today.getDate()) }));
  await user.click(screen.getByRole('button', { name: String(tomorrow.getDate()) }));
  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.click(screen.getByRole('button', { name: 'Add' }));
  await user.type(screen.getByLabelText('Price'), '25000');
  await user.type(screen.getByLabelText('Session minutes'), '45');
  await user.type(screen.getByLabelText('Start date'), '22112025');
  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByLabelText('Restaurant'));

  expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  expect(screen.getByText('Enter promotion dates as valid MM/DD/YYYY dates.')).toBeInTheDocument();
});

it('adds an available date range and time from the add date and time calendar', async () => {
  useStableCalendarDate();
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const startDateLabel = `${today.toLocaleString('en-US', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`;
  const endDateLabel = `${tomorrow.toLocaleString('en-US', { month: 'long' })} ${tomorrow.getDate()}, ${tomorrow.getFullYear()}`;

  const { user } = await render(
    <MemoryRouter>
      <CounselorProfileCreatePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.click(screen.getByRole('button', { name: 'Add date & time' }));

  expect(screen.getByRole('dialog', { name: 'Add date & time' })).toBeInTheDocument();
  expect(
    screen.getByText('Select a date, choose its available times, then pick another date to set different times.')
  ).toBeInTheDocument();
  expect(
    screen.getByText(`${today.toLocaleString('en-US', { month: 'long' })} ${today.getFullYear()}`)
  ).toBeInTheDocument();
  expect(screen.getByText('Select a date')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();

  await user.click(screen.getByRole('button', { name: String(today.getDate()) }));
  expect(screen.getByText(startDateLabel)).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.click(screen.getByRole('button', { name: String(tomorrow.getDate()) }));
  expect(screen.getByText(endDateLabel)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: String(today.getDate()) })).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByRole('button', { name: String(tomorrow.getDate()) })).toHaveAttribute('aria-pressed', 'true');

  await user.click(screen.getByRole('button', { name: '10:00 AM' }));

  expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled();

  await user.click(screen.getByRole('button', { name: 'Add' }));

  expect(screen.queryByRole('dialog', { name: 'Add date & time' })).not.toBeInTheDocument();
  expect(screen.getByText('2 dates, 2 time slots selected. Open calendar to review or edit.')).toBeInTheDocument();
  expect(screen.queryByText(`${startDateLabel} - ${endDateLabel} · 10:00 AM`)).not.toBeInTheDocument();
});

function readBlobText(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}
