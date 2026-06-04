import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import render from '@/utils/test/render';
import { useAdminCancelPayment, useAdminConfirmDeposit, useAdminPayments } from '@/hooks/admin';
import { PaymentsManagementPage } from './PaymentsManagementPage';

vi.mock('@/hooks/admin', () => ({
  useAdminCancelPayment: vi.fn(),
  useAdminConfirmDeposit: vi.fn(),
  useAdminPayments: vi.fn(),
}));

const mockUseAdminPayments = vi.mocked(useAdminPayments);
const mockUseAdminConfirmDeposit = vi.mocked(useAdminConfirmDeposit);
const mockUseAdminCancelPayment = vi.mocked(useAdminCancelPayment);

describe('PaymentsManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdminPayments.mockReturnValue({
      data: {
        payments: [
          {
            paymentId: 7,
            bookingId: 12,
            customerName: 'John',
            customerUsername: 'johnny',
            counselorName: 'Jane',
            counselorUsername: 'jane_counselor',
            totalAmount: 100000,
            status: 'DEPOSIT_REPORTED',
            depositDeadlineAt: '2026-05-28T12:00:00Z',
          },
        ],
        totalElements: 1,
      },
      error: null,
      isLoading: false,
    } as any);
    mockUseAdminConfirmDeposit.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    } as any);
    mockUseAdminCancelPayment.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    } as any);
  });

  it('renders payment rows and confirms deposit with the payment amount', async () => {
    const confirmDeposit = vi.fn().mockResolvedValue(undefined);
    mockUseAdminConfirmDeposit.mockReturnValue({
      isPending: false,
      mutateAsync: confirmDeposit,
    } as any);

    const { user } = await render(
      <MemoryRouter>
        <PaymentsManagementPage />
      </MemoryRouter>
    );

    expect(mockUseAdminPayments).toHaveBeenCalledWith({
      page: 0,
      size: 50,
      status: undefined,
    });
    expect(screen.getAllByText('결제 관리')[0]).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('@johnny')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('@jane_counselor')).toBeInTheDocument();
    expect(screen.getByText('100,000원')).toBeInTheDocument();
    expect(screen.getByText('2026-05-28 21:00:00 KST')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '입금 확인' }));

    expect(confirmDeposit).toHaveBeenCalledWith({
      paymentId: 7,
      data: {
        confirmedAmount: 100000,
      },
    });
  });

  it('cancels a payment with a reason', async () => {
    const cancelPayment = vi.fn().mockResolvedValue(undefined);
    const prompt = vi.spyOn(window, 'prompt').mockReturnValue('wrong deposit');
    mockUseAdminCancelPayment.mockReturnValue({
      isPending: false,
      mutateAsync: cancelPayment,
    } as any);

    const { user } = await render(
      <MemoryRouter>
        <PaymentsManagementPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(cancelPayment).toHaveBeenCalledWith({
      paymentId: 7,
      data: {
        reason: 'wrong deposit',
      },
    });

    prompt.mockRestore();
  });
});
