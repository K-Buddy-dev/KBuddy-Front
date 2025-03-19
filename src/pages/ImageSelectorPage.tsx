import { AlbumItem, Camera, Topbar } from '@/components';
import { useEffect, useState } from 'react';

export function ImageSelectorPage() {
  const [albumList, setAlbumList] = useState([]);

  const handleClickCamera = () => {
    console.log(window.ReactNativeWebView);
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'openCamera' }));
    }
  };

  useEffect(() => {
    // 테스트용 코드
    if (!window.ReactNativeWebView) {
      window.ReactNativeWebView = {
        postMessage: (message: string) => {
          const parsed = JSON.parse(message);
          if (parsed.action === 'getAlbum') {
            setTimeout(() => {
              const fakeData = {
                action: 'albumData',
                album: [
                  new URL('@/assets/images/test/1.jpg', import.meta.url).href,
                  new URL('@/assets/images/test/2.jpg', import.meta.url).href,
                  new URL('@/assets/images/test/3.jpg', import.meta.url).href,
                  new URL('@/assets/images/test/4.jpg', import.meta.url).href,
                  new URL('@/assets/images/test/5.jpg', import.meta.url).href,
                ],
              };
              window.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(fakeData) }));
            }, 500);
          }
        },
      };
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'getAlbum' }));

    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== 'string') return;

      try {
        const data = JSON.parse(event.data);
        if (data.action === 'albumData') {
          setAlbumList(data.album);
        }
      } catch (e) {
        console.error('앨범 데이터 파싱 실패:', e);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      <Topbar title="Recents" type="cancel" />
      <div className="w-full h-screen py-[72px]">
        <div className="w-full overflow-scroll grid grid-cols-3 gap-[5px]">
          <div
            className="bg-bg-medium flex flex-col items-center justify-center gap-1 aspect-square rounded-[4px] cursor-pointer"
            onClick={handleClickCamera}
          >
            <Camera />
            <p className="font-medium">Camera</p>
          </div>
          {albumList.map((img, index) => (
            <AlbumItem key={`${img}-${index}`} img={img} />
          ))}
        </div>
      </div>
    </>
  );
}
