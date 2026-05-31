import { useState } from 'react';
import { StarRating } from './StarRating';
import type { CounselorReview } from '@/services/counselorService';

interface ServiceReviewItemProps {
  review: CounselorReview;
}

export const ServiceReviewItem: React.FC<ServiceReviewItemProps> = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const comment = review.comment || '';
  const customerName = review.customerName || 'User';

  const shouldTruncate = comment.length > 100;
  const displayText = isExpanded || !shouldTruncate ? comment : `${comment.slice(0, 100)}...`;

  return (
    <div className="flex w-full flex-col items-start border-t-2 border-border-weak2">
      <div className="flex w-full p-4 flex-col items-start">
        <div className="flex pb-4 flex-col items-start gap-2 w-full">
          {/* Profile and Date */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-medium text-text-default font-roboto text-label-300-heavy font-medium">
              {customerName.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-start gap-0.5">
                <span className="text-text-default font-roboto text-label-300-heavy font-medium leading-3 tracking-[0.24px]">
                  @ {customerName}
                </span>
              </div>
              <span className="text-text-weak font-roboto text-label-300-heavy font-medium leading-3 tracking-[0.24px]">
                {formatReviewDate(review.createdAt)}
              </span>
            </div>
          </div>

          {/* Rating and Description */}
          <div className="flex flex-col items-start gap-2 w-full">
            {/* Rating */}
            <div className="flex items-center gap-0.5">
              <StarRating rating={review.rating} size="medium" />
            </div>

            {/* Description */}
            <div className="flex flex-col items-start gap-0.5 w-full">
              <div className="flex w-full max-w-[328px] flex-col justify-center overflow-hidden">
                <span className="text-text-default font-roboto text-body-200-light font-normal leading-5 tracking-[0.25px]">
                  {displayText}{' '}
                  {shouldTruncate && !isExpanded && (
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="text-text-strong font-semibold underline inline"
                    >
                      Read more
                    </button>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatReviewDate(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return createdAt;

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
