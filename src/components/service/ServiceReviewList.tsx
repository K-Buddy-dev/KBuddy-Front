import { useState } from 'react';
import { StarRating } from './StarRating';
import { ServiceReviewItem } from './ServiceReviewItem';
import { Button } from '@/components/shared/button/Button';
import type { CounselorReview } from '@/services/counselorService';

interface ServiceReviewListProps {
  errorMessage?: string;
  isLoading?: boolean;
  rating: number;
  reviewCount: number;
  reviews: CounselorReview[];
  showAll?: boolean;
}

export const ServiceReviewList: React.FC<ServiceReviewListProps> = ({
  errorMessage = '',
  isLoading = false,
  rating,
  reviewCount,
  reviews,
  showAll = false,
}) => {
  const [showAllReviews, setShowAllReviews] = useState(showAll);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const canViewMore = !showAllReviews && reviews.length > 3;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex w-full px-4 pb-6 flex-col items-start gap-6">
        <div className="flex flex-col items-start w-full">
          {/* Section Title */}
          <div className="flex w-full pt-6 pb-4 items-center gap-1">
            <h2 className="flex-1 text-text-default font-roboto text-title-200-medium font-medium leading-6 tracking-[0.15px]">
              Review
            </h2>

            {/* Rating Summary */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <StarRating rating={rating} size="medium" />
                <span className="text-text-default font-roboto text-body-200-medium font-medium leading-[14px] tracking-[0.28px]">
                  {rating} out of 5
                </span>
              </div>
              <span className="text-text-weak font-roboto text-body-200-medium font-medium leading-[14px] tracking-[0.28px]">
                ({reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Review Items */}
          {isLoading && (
            <div className="w-full border-t-2 border-border-weak2 px-4 py-6 text-text-weak font-roboto text-body-200-light">
              Loading reviews...
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="w-full border-t-2 border-border-weak2 px-4 py-6 text-text-danger-default font-roboto text-body-200-light">
              {errorMessage}
            </div>
          )}

          {!isLoading && !errorMessage && displayedReviews.length === 0 && (
            <div className="w-full border-t-2 border-border-weak2 px-4 py-6 text-text-weak font-roboto text-body-200-light">
              No reviews yet.
            </div>
          )}

          {!isLoading &&
            !errorMessage &&
            displayedReviews.map((review, index) => (
              <ServiceReviewItem key={review.reviewId ?? review.id ?? index} review={review} />
            ))}
        </div>
      </div>

      {/* View More Button */}
      {canViewMore && (
        <div className="flex pt-4 flex-col items-center gap-2 w-full px-4">
          <Button
            variant="outline"
            color="secondary"
            size="medium"
            onClick={() => setShowAllReviews(true)}
            className="w-full max-w-[328px]"
          >
            View more review
          </Button>
        </div>
      )}
    </div>
  );
};
