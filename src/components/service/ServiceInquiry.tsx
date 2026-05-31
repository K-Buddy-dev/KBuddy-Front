import { Button } from '@/components/shared/button/Button';
import type { CounselorInquiryDetail, CounselorInquiryListItem } from '@/services/counselorService';
import { ServiceInquiryItem } from './ServiceInquiryItem';

interface ServiceInquiryProps {
  compact?: boolean;
  detailById?: Record<number, CounselorInquiryDetail>;
  expandedInquiryId?: number | null;
  inquiries: CounselorInquiryListItem[];
  isLoading?: boolean;
  loadingDetailId?: number | null;
  onAskSeller?: () => void;
  onReply?: (id: number) => void;
  onReplyDraftChange?: (value: string) => void;
  onSelectInquiry?: (id: number) => void;
  onSubmitReply?: (id: number) => void;
  replyDraft?: string;
  replyingTo?: number | null;
  replyErrorMessage?: string;
  totalCount?: number;
  errorMessage?: string;
  isSubmittingReply?: boolean;
}

export const ServiceInquiry: React.FC<ServiceInquiryProps> = ({
  compact = false,
  detailById = {},
  expandedInquiryId = null,
  inquiries,
  isLoading = false,
  loadingDetailId = null,
  onAskSeller,
  onReply,
  onReplyDraftChange,
  onSelectInquiry,
  onSubmitReply,
  replyDraft = '',
  replyingTo = null,
  replyErrorMessage = '',
  totalCount = inquiries.length,
  errorMessage = '',
  isSubmittingReply = false,
}) => {
  return (
    <div className="flex flex-col items-start w-full">
      {/* Section Title */}
      <div className="flex px-4 items-start gap-2 w-full">
        <div className="flex flex-col w-full pt-6 pb-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-text-default font-roboto text-title-200-medium font-medium leading-6 tracking-[0.15px]">
              Inquiry
            </h2>
            <span className="text-text-weak font-roboto text-body-200-medium font-medium leading-5">
              {totalCount} inquiries
            </span>
          </div>
        </div>
      </div>

      {/* Inquiry Comments */}
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="flex w-full px-4 py-6 items-center gap-2 bg-bg-medium">
          <div className="flex flex-col items-start gap-4 w-full">
            {isLoading && (
              <p className="w-full rounded-lg bg-bg-default p-4 text-text-weak font-roboto text-body-200-light">
                Loading inquiries...
              </p>
            )}

            {!isLoading && errorMessage && (
              <p className="w-full rounded-lg bg-bg-default p-4 text-text-danger-default font-roboto text-body-200-light">
                {errorMessage}
              </p>
            )}

            {!isLoading && !errorMessage && inquiries.length === 0 && (
              <p className="w-full rounded-lg bg-bg-default p-4 text-text-weak font-roboto text-body-200-light">
                No inquiries yet.
              </p>
            )}

            {!isLoading &&
              !errorMessage &&
              inquiries.map((inquiry) => (
                <ServiceInquiryItem
                  key={inquiry.inquiryId}
                  detail={detailById[inquiry.inquiryId]}
                  inquiry={inquiry}
                  isExpanded={expandedInquiryId === inquiry.inquiryId}
                  isLoadingDetail={loadingDetailId === inquiry.inquiryId}
                  isSubmittingReply={isSubmittingReply}
                  onReply={onReply || noop}
                  onReplyDraftChange={onReplyDraftChange || noop}
                  onSelect={onSelectInquiry || noop}
                  onSubmitReply={onSubmitReply || noop}
                  replyDraft={replyDraft}
                  replyingTo={replyingTo}
                  replyErrorMessage={replyErrorMessage}
                />
              ))}
          </div>
        </div>

        {/* Ask Button */}
        {!compact && (
          <div className="flex flex-col items-center gap-2 w-full px-4 pb-6">
            <Button
              variant="outline"
              color="secondary"
              size="medium"
              onClick={onAskSeller || noop}
              className="w-full max-w-[328px]"
            >
              Ask the seller
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

function noop() {}
