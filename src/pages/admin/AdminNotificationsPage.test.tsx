import { screen } from '@testing-library/react';
import render from '@/utils/test/render';
import { AdminNotificationsPage } from './AdminNotificationsPage';
import { adminService } from '@/services/adminService';

vi.mock('@/components/admin', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/services/adminService', () => ({
  adminService: {
    sendNotification: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(adminService.sendNotification).mockResolvedValue({ sentCount: 42 });
});

it('sends a free notification to all users and shows the sent count', async () => {
  const { user } = await render(<AdminNotificationsPage />);

  await user.type(screen.getByLabelText('Title'), 'New Feature Available');
  await user.type(screen.getByLabelText('Message'), 'Check out our latest update!');
  await user.type(screen.getByLabelText('Target path or ID'), '/service');
  await user.click(screen.getByRole('button', { name: 'Send notification' }));

  expect(adminService.sendNotification).toHaveBeenCalledWith({
    message: 'Check out our latest update!',
    targetId: '/service',
    title: 'New Feature Available',
  });
  expect(await screen.findByText('Notification sent to 42 users.')).toBeInTheDocument();
});

it('sends targetId as null when target is left empty', async () => {
  const { user } = await render(<AdminNotificationsPage />);

  await user.type(screen.getByLabelText('Title'), 'Notice');
  await user.type(screen.getByLabelText('Message'), 'General announcement');
  await user.click(screen.getByRole('button', { name: 'Send notification' }));

  expect(adminService.sendNotification).toHaveBeenCalledWith({
    message: 'General announcement',
    targetId: null,
    title: 'Notice',
  });
});
