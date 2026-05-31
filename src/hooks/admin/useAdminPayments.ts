import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import {
  AdminPayment,
  CancelPaymentRequest,
  ConfirmDepositRequest,
  PaymentListData,
  PaymentListResponse,
} from '@/types/admin';
import { adminKeys } from './adminKeys';

export const useAdminPayments = ({
  page = 0,
  size = 50,
  status,
}: {
  page?: number;
  size?: number;
  status?: string;
} = {}) => {
  return useQuery({
    queryKey: adminKeys.paymentList(page, size, status),
    queryFn: async () => {
      const response = await adminService.getPayments({ page, size, status });
      return unwrapPaymentList(response.data);
    },
  });
};

export const useAdminConfirmDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, data }: { paymentId: number; data?: ConfirmDepositRequest }) =>
      adminService.confirmDeposit(paymentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.payments() });
    },
  });
};

export const useAdminCancelPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, data }: { paymentId: number; data: CancelPaymentRequest }) =>
      adminService.cancelPayment(paymentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.payments() });
    },
  });
};

export function unwrapPaymentList(response: PaymentListResponse | PaymentListData): PaymentListData {
  const listData = 'data' in response ? response.data : response;

  if ('payments' in listData) {
    return {
      ...listData,
      payments: listData.payments.map(normalizePayment),
    };
  }

  return {
    payments: listData.content.map(normalizePayment),
    totalElements: listData.totalElements,
    page: listData.number,
    size: listData.size,
  };
}

function normalizePayment(payment: AdminPayment): AdminPayment {
  return {
    ...payment,
    createdAt: payment.createdAt || payment.createdDate,
    depositDeadlineAt: payment.depositDeadlineAt || payment.depositDueAt,
  };
}
