import { ServiceBadge } from './ServiceBadge';
import { CategoryBadge } from './CategoryBadge';

interface ServiceCardProps {
  imageUrl: string;
  title: string;
  sellerId: string;
  rating: number;
  categoryName: string;
  duration: string;
  price: string;
  badgeType?: 'new' | 'trending';
  categoryType?: '1:1 Chat' | 'Group';
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  imageUrl,
  title,
  sellerId,
  rating,
  categoryName,
  duration,
  price,
  badgeType,
  categoryType = '1:1 Chat',
  onClick,
}) => {
  return (
    <div
      className="flex w-full flex-col items-center gap-2 rounded-lg shadow-default relative cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-start relative w-full">
        {/* Image with badges */}
        <div className="relative w-full">
          <img src={imageUrl} alt={title} className="w-full h-[180px] object-cover rounded-t-lg" />

          {/* Category Badge - Bottom Left */}
          <div className="absolute bottom-2 left-4">
            <CategoryBadge type={categoryType} />
          </div>

          {/* Status Badge - Top Right */}
          {badgeType && (
            <div className="absolute top-2 right-2">
              <ServiceBadge type={badgeType} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col items-start px-4 pb-4 rounded-b-lg border-r border-b border-l border-border-weak2 bg-bg-default w-full">
          <div className="flex flex-col items-start gap-2 w-full pt-2 pb-3">
            {/* Title */}
            <h3
              className="text-text-default font-roboto text-body-100-medium font-medium leading-6 tracking-[0.15px] line-clamp-2 w-full"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </h3>

            {/* Seller and Rating */}
            <div className="flex flex-col justify-end items-start gap-1.5 w-full">
              <div className="flex items-center flex-wrap gap-2 w-full">
                <span className="text-text-weak font-roboto text-label-300-heavy font-medium leading-3 tracking-[0.24px]">
                  {sellerId}
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {/* Star Icon */}
                    <div className="flex w-3.5 h-3.5 justify-center items-center">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.875" y="0.875" width="12.25" height="12.25" rx="0.65625" fill="#30FF21" />
                        <path
                          d="M6.76371 9.85785C6.89475 9.78033 7.05844 9.78033 7.18948 9.85785L9.2285 11.0884C9.54626 11.2803 9.94096 10.9948 9.85607 10.6362L9.3163 8.3281C9.28077 8.17613 9.33289 8.01677 9.45202 7.91367L11.2407 6.35131C11.5224 6.10647 11.3717 5.64986 11.0022 5.61845L8.59622 5.41696C8.44188 5.40377 8.30707 5.30596 8.24483 5.16309L7.31629 3.00401C7.17151 2.66533 6.68168 2.66533 6.5369 3.00401L5.60836 5.16309C5.54612 5.30596 5.41131 5.40377 5.25697 5.41696L2.85097 5.61845C2.48152 5.64986 2.33084 6.10647 2.61248 6.35131L4.40117 7.91367C4.5203 8.01677 4.57242 8.17613 4.53689 8.3281L3.99712 10.6362C3.91223 10.9948 4.30693 11.2803 4.62469 11.0884L6.66371 9.85785Z"
                          fill="#222222"
                        />
                      </svg>
                    </div>
                    <span className="text-text-default font-roboto text-label-300-heavy font-medium leading-3 tracking-[0.24px]">
                      {rating}
                    </span>
                  </div>
                </div>
              </div>
              {/* Category */}
              <div className="flex items-start gap-1 w-full">
                <span className="flex-1 text-text-weak font-roboto text-label-300-light font-normal leading-4">
                  {categoryName}
                </span>
              </div>
            </div>
          </div>

          {/* Duration and Price */}
          <div className="flex w-full h-9 px-3 flex-col items-end gap-1 rounded-lg bg-bg-medium">
            <div className="flex items-center gap-2 h-full">
              <span className="text-text-weak font-roboto text-label-300-heavy font-medium leading-3 tracking-[0.24px]">
                {duration}
              </span>
              <span className="text-text-default font-roboto text-body-200-medium font-medium leading-5 tracking-[0.25px]">
                {price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
