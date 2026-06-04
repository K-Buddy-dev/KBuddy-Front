import type { CounselorInquiryDetail, CounselorInquiryListItem } from '@/services/counselorService';

interface ServiceInquiryItemProps {
  detail?: CounselorInquiryDetail;
  inquiry: CounselorInquiryListItem;
  isExpanded: boolean;
  isLoadingDetail: boolean;
  onReply: (id: number) => void;
  onSelect: (id: number) => void;
  replyDraft: string;
  replyingTo: number | null;
  replyErrorMessage?: string;
  onReplyDraftChange: (value: string) => void;
  onSubmitReply: (id: number) => void;
  isSubmittingReply?: boolean;
}

export const ServiceInquiryItem: React.FC<ServiceInquiryItemProps> = ({
  detail,
  inquiry,
  isExpanded,
  isLoadingDetail,
  onReply,
  onSelect,
  replyDraft,
  replyingTo,
  replyErrorMessage = '',
  onReplyDraftChange,
  onSubmitReply,
  isSubmittingReply = false,
}) => {
  const isReplying = replyingTo === inquiry.inquiryId;
  const hasReply = Boolean(inquiry.hasReply || (inquiry.replyCount ?? 0) > 0 || (detail?.replies.length ?? 0) > 0);

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg bg-bg-default p-3">
      <button
        type="button"
        aria-label={inquiry.title}
        className="flex w-full flex-col items-start gap-2 text-left"
        onClick={() => onSelect(inquiry.inquiryId)}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <span className="text-text-default font-roboto text-body-100-medium font-medium leading-6">
            {inquiry.title}
          </span>
          <span className="shrink-0 text-text-weak font-roboto text-label-300-heavy font-medium leading-3">
            {formatInquiryDate(inquiry.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-weak font-roboto text-label-300-heavy font-medium leading-3">
            @{inquiry.writerName}
          </span>
          {inquiry.isSecret && (
            <span className="rounded bg-bg-medium px-2 py-0.5 text-text-weak font-roboto text-label-300-heavy leading-3">
              Secret
            </span>
          )}
          {hasReply && (
            <span className="rounded bg-bg-brand-weak px-2 py-0.5 text-text-brand-default font-roboto text-label-300-heavy leading-3">
              Answered
            </span>
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-3 border-t border-border-weak2 pt-3">
          {isLoadingDetail ? (
            <p className="text-text-weak font-roboto text-body-200-light leading-5">Loading inquiry...</p>
          ) : detail ? (
            <>
              <p className="whitespace-pre-line text-text-default font-roboto text-body-200-light leading-5">
                {detail.content}
              </p>

              {detail.replies.length > 0 && (
                <div className="flex flex-col gap-2">
                  {detail.replies.map((reply) => (
                    <div key={reply.replyId} className="ml-5 rounded-lg bg-bg-medium p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-text-default font-roboto text-label-300-heavy font-medium leading-3">
                          @{reply.authorName}
                        </span>
                        <span className="text-text-weak font-roboto text-label-300-heavy font-medium leading-3">
                          {formatInquiryDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="whitespace-pre-line text-text-default font-roboto text-body-200-light leading-5">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {isReplying && (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="min-h-[88px] w-full rounded-lg border border-border-default px-3 py-2 text-text-default font-roboto text-body-200-light outline-none focus:border-border-brand"
                    maxLength={1000}
                    onChange={(event) => onReplyDraftChange(event.target.value)}
                    placeholder="Write a reply"
                    value={replyDraft}
                  />
                  {replyErrorMessage && (
                    <p className="text-text-danger-default font-roboto text-label-300-heavy leading-3">
                      {replyErrorMessage}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="rounded-lg bg-bg-brand-default px-4 py-2 text-white font-roboto text-label-300-heavy font-medium disabled:bg-bg-disabled"
                      disabled={isSubmittingReply || replyDraft.trim().length === 0}
                      onClick={() => onSubmitReply(inquiry.inquiryId)}
                    >
                      Post reply
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onReply(inquiry.inquiryId)}
                  aria-pressed={isReplying}
                  className="text-text-default text-right font-roboto text-label-300-heavy font-medium leading-3 tracking-[0.24px]"
                >
                  Reply
                </button>
              </div>
            </>
          ) : (
            <p className="text-text-weak font-roboto text-body-200-light leading-5">Unable to load inquiry.</p>
          )}
        </div>
      )}
    </div>
  );
};

function formatInquiryDate(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return createdAt;

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
