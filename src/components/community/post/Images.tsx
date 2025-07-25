import { CancelIcon, LeftArrowTriangle, RightArrowTriangle } from '@/components/shared';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { base64ToFile } from '@/utils/utils';
import { useEffect, useState } from 'react';

interface ImagesProps {
  imageUrls?: string[];
  setImageUrls?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Images = ({ imageUrls = [], setImageUrls }: ImagesProps) => {
  const [maxImageMessage, setMaxImageMessage] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { type, images } = useCommunityFormStateContext();
  const { setImages } = useCommunityFormActionContext();

  const MAX_IMAGES = type === 'Q&A' ? 5 : 10;

  const handleAlbumDataFromRN = (event: MessageEvent) => {
    if (typeof event.data !== 'string') return;

    try {
      const data = JSON.parse(event.data);

      switch (data.action) {
        case 'albumData':
          if (data.album && data.album.length > 0) {
            console.log('data.album', data.album);
            const files = data.album.map((base64: string, index: number) =>
              base64ToFile(base64, `selected-image-${index}.jpg`)
            );
            setImages((prev) => {
              const newFiles = [...prev, ...files];
              return newFiles.slice(0, MAX_IMAGES);
            });
            setImageUrls?.((prev) => {
              const newUrls = [...prev, ...data.album];
              return newUrls.slice(0, MAX_IMAGES);
            });
          }
          break;
        case 'swipe':
          if (data.direction === 'left' && currentIndex < imageUrls.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else if (data.direction === 'right' && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }
          break;
      }
    } catch (e) {
      console.error('앨범 데이터 파싱 실패:', e);
    }
  };

  const handleWebFileSelection = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const files = Array.from(target.files);

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
          alert('Only JPEG, PNG, JPG, and WEBP images can be uploaded.');
          return;
        }

        setImages((prev) => {
          const newFiles = [...prev, ...files];
          return newFiles.slice(0, MAX_IMAGES);
        });
        const urls = files.map((file) => URL.createObjectURL(file));
        setImageUrls?.((prev) => {
          const newUrls = [...prev, ...urls];
          return newUrls.slice(0, MAX_IMAGES);
        });
      }
    };

    input.click();
  };

  const handleImageSelection = () => {
    if (imageUrls.length >= MAX_IMAGES) {
      return;
    }
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'getAlbum', type }));
    } else {
      handleWebFileSelection();
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls?.((prev) => prev.filter((_, i) => i !== index));
    if (currentIndex >= imageUrls.length - 1) {
      setCurrentIndex(Math.max(0, imageUrls.length - 2));
    }
  };

  useEffect(() => {
    if (imageUrls.length >= MAX_IMAGES) {
      setMaxImageMessage(`You can add up to ${MAX_IMAGES} images.`);
    } else {
      setMaxImageMessage(`${MAX_IMAGES - imageUrls.length} more image(s) can be selected.`);
    }
  }, [imageUrls.length]);

  useEffect(() => {
    if (images.length > 0) {
      const urls = images.map((file) => URL.createObjectURL(file));
      setImageUrls?.(urls);
    }

    window.addEventListener('message', handleAlbumDataFromRN);
    document.addEventListener('message', handleAlbumDataFromRN as EventListener);

    return () => {
      window.removeEventListener('message', handleAlbumDataFromRN);
      document.removeEventListener('message', handleAlbumDataFromRN as EventListener);
    };
  }, []);

  return (
    <div className="bg-bg-medium">
      <div className="w-full flex flex-col justify-center items-center gap-4 p-4">
        {maxImageMessage && <div className="w-full text-center text-text-weak text-xs mb-1">{maxImageMessage}</div>}
        <div
          className="overflow-x-hidden flex items-center gap-4 w-[528px] h-[200px] relative"
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const startX = touch.clientX;

            const handleTouchMove = (e: TouchEvent) => {
              const touch = e.touches[0];
              const diffX = touch.clientX - startX;

              if (Math.abs(diffX) > 50) {
                if (diffX > 0 && currentIndex > 0) {
                  setCurrentIndex(currentIndex - 1);
                } else if (diffX < 0 && currentIndex < imageUrls.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                }
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              }
            };

            const handleTouchEnd = () => {
              document.removeEventListener('touchmove', handleTouchMove);
              document.removeEventListener('touchend', handleTouchEnd);
            };

            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
          }}
        >
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className={`absolute transition-transform duration-300 ${
                index === currentIndex
                  ? 'translate-x-[176px]'
                  : index < currentIndex
                    ? index === currentIndex - 1
                      ? 'translate-x-[0px]'
                      : index === currentIndex - 2
                        ? 'translate-x-[-176px]'
                        : 'translate-x-[-352px]'
                    : index === currentIndex + 1
                      ? 'translate-x-[352px]'
                      : index === currentIndex + 2
                        ? 'translate-x-[528px]'
                        : 'translate-x-[704px]'
              }`}
            >
              <div className="relative">
                <img src={url} alt={`Preview ${index + 1}`} className="w-40 h-[200px] object-cover rounded" />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full hover:bg-gray-100"
                >
                  <CancelIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-between items-center gap-[26px]">
          <div className="w-20"></div>
          <div className="flex justify-between items-center gap-[10px]">
            <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)}>
              <LeftArrowTriangle isDisabled={currentIndex === 0} />
            </button>
            <span className="text-text-default font-medium text-xs">
              {imageUrls.length > 0 ? `${currentIndex + 1}/${imageUrls.length}` : '0/0'}
            </span>
            <button disabled={currentIndex === imageUrls.length - 1} onClick={() => setCurrentIndex(currentIndex + 1)}>
              <RightArrowTriangle isDisabled={imageUrls.length === 0 || currentIndex === imageUrls.length - 1} />
            </button>
          </div>
          <span
            className="w-20 text-end text-text-default font-semibold text-sm underline cursor-pointer"
            onClick={handleImageSelection}
          >
            Add photos
          </span>
        </div>
      </div>
    </div>
  );
};
