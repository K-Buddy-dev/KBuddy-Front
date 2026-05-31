import { describe, expect, it } from 'vitest';
import { unwrapPaymentList } from './useAdminPayments';
import { PaymentListResponse } from '@/types/admin';

describe('unwrapPaymentList', () => {
  it('normalizes Spring page content responses into payment list data', () => {
    const response: PaymentListResponse = {
      timestamp: '2026-05-27T22:29:29Z',
      status: 200,
      code: 'KB-HTTP-200',
      path: '/kbuddy/v1/admin/payments',
      data: {
        content: [
          {
            paymentId: 1,
            bookingId: 5,
            customerId: 2,
            counselorId: 1,
            method: 'BANK_TRANSFER',
            status: 'AWAITING_DEPOSIT',
            totalAmount: 20000,
            depositDueAt: '2026-05-28T22:26:14Z',
            createdDate: '2026-05-27T22:26:14Z',
          },
        ],
        totalElements: 1,
        number: 0,
        size: 50,
      },
      details: [],
    };

    expect(unwrapPaymentList(response)).toEqual({
      payments: [
        expect.objectContaining({
          paymentId: 1,
          status: 'AWAITING_DEPOSIT',
          totalAmount: 20000,
          depositDeadlineAt: '2026-05-28T22:26:14Z',
          createdAt: '2026-05-27T22:26:14Z',
        }),
      ],
      totalElements: 1,
      page: 0,
      size: 50,
    });
  });
});
