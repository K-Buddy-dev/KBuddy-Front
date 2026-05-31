import { AdminLayout } from '@/components/admin';
import { useAdminCancelPayment, useAdminConfirmDeposit, useAdminPayments } from '@/hooks/admin';
import { AdminPayment } from '@/types/admin';
import { formatKstDateTime } from '@/utils/adminDateTime';
import { useState } from 'react';

const statusOptions = [
  { label: '전체', value: '' },
  { label: '입금 대기', value: 'AWAITING_DEPOSIT' },
  { label: '입금 신고', value: 'DEPOSIT_REPORTED' },
  { label: '대기', value: 'PENDING' },
  { label: '결제 완료', value: 'PAID' },
  { label: '취소', value: 'CANCELED' },
];

export const PaymentsManagementPage = () => {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const size = 50;
  const { data, error, isLoading } = useAdminPayments({ page, size, status: status || undefined });
  const confirmDeposit = useAdminConfirmDeposit();
  const cancelPayment = useAdminCancelPayment();

  const handleLogout = () => {
    console.log('로그아웃');
  };

  const handleConfirmDeposit = async (payment: AdminPayment) => {
    await confirmDeposit.mutateAsync({
      paymentId: payment.paymentId,
      data: {
        confirmedAmount: payment.totalAmount,
      },
    });
  };

  const handleCancelPayment = async (payment: AdminPayment) => {
    const reason = window.prompt('취소 사유를 입력해주세요.');
    if (!reason?.trim()) return;

    await cancelPayment.mutateAsync({
      paymentId: payment.paymentId,
      data: {
        reason: reason.trim(),
      },
    });
  };

  const payments = data?.payments || [];
  const totalPages = data ? Math.ceil(data.totalElements / size) : 0;

  return (
    <AdminLayout userName="관리자" onLogout={handleLogout} defaultActiveMenu="payments">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-headline-100-heavy text-text-default">결제 관리</h1>
            <p className="text-body-200-medium text-text-weak mt-2">입금 확인 후 결제를 완료 처리합니다.</p>
          </div>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(0);
            }}
            className="rounded border border-border-default bg-white px-3 py-2 text-body-200-medium"
          >
            {statusOptions.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-default overflow-hidden">
          {isLoading && (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-border-brand-default border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-body-200-medium text-text-weak">결제 목록을 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <p className="text-body-200-medium text-text-danger-default">결제 목록을 불러오는데 실패했습니다.</p>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <table className="w-full">
                <thead className="bg-bg-medium border-b border-border-weak2">
                  <tr>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">결제 ID</th>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">예약 ID</th>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">사용자</th>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">상담사</th>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">금액</th>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">상태</th>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">입금기한</th>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-body-200-medium text-text-weak">
                        결제 내역이 없습니다
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr
                        key={payment.paymentId}
                        className="border-b border-border-weak2 hover:bg-bg-highlight-hover transition-colors"
                      >
                        <td className="px-6 py-4 text-body-200-medium text-text-default">{payment.paymentId}</td>
                        <td className="px-6 py-4 text-body-200-medium text-text-default">{payment.bookingId}</td>
                        <td className="px-6 py-4">
                          <PersonCell
                            name={payment.customerName}
                            username={payment.customerUsername}
                            fallbackId={payment.customerId}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <PersonCell
                            name={payment.counselorName}
                            username={payment.counselorUsername}
                            fallbackId={payment.counselorId}
                          />
                        </td>
                        <td className="px-6 py-4 text-body-200-medium text-text-default">
                          {formatWon(payment.totalAmount)}
                        </td>
                        <td className="px-6 py-4">{getPaymentStatusBadge(payment.status)}</td>
                        <td className="px-6 py-4 text-body-200-medium text-text-weak">
                          {formatKstDateTime(payment.depositDeadlineAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={
                                payment.status === 'PAID' || payment.status === 'REFUNDED' || confirmDeposit.isPending
                              }
                              onClick={() => handleConfirmDeposit(payment)}
                              className="rounded bg-bg-brand-default px-3 py-2 text-label-200-heavy text-white disabled:bg-bg-highlight-disabled disabled:text-text-disabled"
                            >
                              입금 확인
                            </button>
                            <button
                              type="button"
                              disabled={
                                payment.status === 'PAID' || payment.status === 'REFUNDED' || cancelPayment.isPending
                              }
                              onClick={() => handleCancelPayment(payment)}
                              className="rounded border border-border-default px-3 py-2 text-label-200-heavy text-text-default disabled:bg-bg-highlight-disabled disabled:text-text-disabled"
                            >
                              취소
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="px-6 py-4 flex items-center justify-between border-t border-border-weak2">
                <span className="text-body-200-medium text-text-weak">총 {data?.totalElements || 0}건</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 text-body-200-medium text-text-default border border-border-default rounded hover:bg-bg-highlight-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  <span className="px-4 text-body-200-medium text-text-default">
                    {page + 1} / {totalPages || 1}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 text-body-200-medium text-text-default border border-border-default rounded hover:bg-bg-highlight-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

function formatWon(amount: number) {
  return `${amount.toLocaleString()}원`;
}

function formatId(id?: number) {
  return id ? `#${id}` : '-';
}

function PersonCell({ name, username, fallbackId }: { name?: string; username?: string; fallbackId?: number }) {
  const primary = name || username || formatId(fallbackId);
  const secondary = name && username && name !== username ? username : undefined;

  return (
    <div>
      <p className="text-body-200-medium text-text-default">{primary}</p>
      {secondary && <p className="mt-1 text-label-200-medium text-text-weak">@{secondary}</p>}
    </div>
  );
}

function getPaymentStatusBadge(status: string) {
  const className =
    status === 'PAID'
      ? 'bg-bg-success-weak text-text-success-default'
      : status === 'DEPOSIT_REPORTED'
        ? 'bg-bg-brand-weak text-text-brand-default'
        : status === 'CANCELED'
          ? 'bg-bg-highlight-disabled text-text-disabled'
          : 'bg-bg-medium text-text-weak';

  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-label-300-heavy ${className}`}>{status}</span>
  );
}
