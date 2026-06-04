import { useState } from 'react';
import { Button } from '@/components/shared/button/Button';

interface ServicePhotoGalleryProps {
  photoUrls: string[];
  compact?: boolean;
}

export const ServicePhotoGallery: React.FC<ServicePhotoGalleryProps> = ({ photoUrls, compact = false }) => {
  const [showAll, setShowAll] = useState(!compact);
  const photos = showAll ? photoUrls : photoUrls.slice(0, 6);
  const photoCount = photoUrls.length;
  const imageClasses = [
    'left-0 top-0 w-40 h-[200px]',
    'left-[168px] top-0 w-40 h-[90px]',
    'left-[168px] top-[98px] w-40 h-40',
    'left-0 top-[208px] w-40 h-32',
    'left-0 top-[344px] w-40 h-40',
    'left-[168px] top-[266px] w-40 h-[200px]',
  ];

  return (
    <div className="flex w-full px-4 flex-col items-start">
      {/* Section Title */}
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col pt-6 pb-4 items-center gap-1">
          <div className="flex flex-col items-start gap-1">
            <h2 className="text-text-default font-roboto text-title-200-medium font-medium leading-6 tracking-[0.15px]">
              Photo
            </h2>
            <span className="text-text-default font-roboto text-body-100-light font-normal leading-6 tracking-[0.5px]">
              {photoCount} photos
            </span>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="w-full pb-6">
        {photos.length === 1 ? (
          <img src={photos[0]} alt="Gallery 1" className="w-full rounded-lg object-cover" />
        ) : photos.length > 0 ? (
          <div className="w-full h-[504px] relative">
            {photos.slice(0, 6).map((photoUrl, index) => (
              <img
                key={photoUrl}
                src={photoUrl}
                alt={`Gallery ${index + 1}`}
                className={`absolute ${imageClasses[index]} rounded-lg object-cover`}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-lg bg-bg-medium text-[14px] font-medium text-text-weak">
            No photos yet.
          </div>
        )}

        {/* View More Button */}
        {!showAll && photoUrls.length > 6 && (
          <div className="flex pt-6 flex-col items-center gap-2">
            <Button
              variant="outline"
              color="secondary"
              size="medium"
              onClick={() => setShowAll(true)}
              className="w-full max-w-[328px]"
            >
              View more photo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
