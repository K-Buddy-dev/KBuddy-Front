import { CancelIcon, LeftArrowTriangle, RightArrowTriangle } from '@/components/shared';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { base64ToFile } from '@/utils/utils';
import { useEffect, useState } from 'react';

export const Images = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { file, type } = useCommunityFormStateContext();
  const { setFile } = useCommunityFormActionContext();

  const MAX_IMAGES = type === 'qna' ? 5 : 10;

  const handleAlbumDataFromRN = (event: MessageEvent) => {
    console.log('RN 수신 데이터: ', event.data);
    if (typeof event.data !== 'string') return;

    try {
      const data = JSON.parse(event.data);
      console.log('JSON parsed 데이터: ', data);
      if (data.action === 'albumData') {
        console.log('앨범 데이터 수신: ', data.album);

        if (data.album && data.album.length > 0) {
          const files = data.album.map((base64: string, index: number) =>
            base64ToFile(base64, `selected-image-${index}.jpg`)
          );
          setFile((prev) => {
            const newFiles = [...prev, ...files];
            return newFiles.slice(0, MAX_IMAGES);
          });
          setImageUrls((prev) => {
            const newUrls = [...prev, ...data.album];
            return newUrls.slice(0, MAX_IMAGES);
          });
        }
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
        setFile((prev) => {
          const newFiles = [...prev, ...files];
          return newFiles.slice(0, MAX_IMAGES);
        });
        const urls = files.map((file) => URL.createObjectURL(file));
        setImageUrls((prev) => {
          const newUrls = [...prev, ...urls];
          return newUrls.slice(0, MAX_IMAGES);
        });
      }
    };

    input.click();
  };

  const handleImageSelection = () => {
    if (imageUrls.length >= MAX_IMAGES) {
      alert(`최대 ${MAX_IMAGES}개의 이미지만 첨부할 수 있습니다.`);
      return;
    }
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'getAlbum' }));
    } else {
      handleWebFileSelection();
    }
  };

  const handleDeleteImage = (index: number) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    if (currentIndex >= imageUrls.length - 1) {
      setCurrentIndex(Math.max(0, imageUrls.length - 2));
    }
  };

  useEffect(() => {
    if (file && !window.ReactNativeWebView) {
      const urls = file.map((file) => URL.createObjectURL(file));
      setImageUrls(urls);
    }
  }, [file]);

  useEffect(() => {
    window.addEventListener('message', handleAlbumDataFromRN);

    return () => {
      window.removeEventListener('message', handleAlbumDataFromRN);
    };
  }, []);

  return (
    <div className="bg-bg-medium">
      <div className="w-full flex flex-col justify-center items-center gap-4 p-4">
        <div className="overflow-x-hidden flex items-center gap-4 w-[528px] h-[200px] relative">
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
