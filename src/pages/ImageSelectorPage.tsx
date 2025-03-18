import { Topbar } from '@/components';
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
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'getAlbum' }));
    }

    const handleMessage = (event: MessageEvent) => {
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
        <div className="w-full h-full overflow-scroll grid grid-cols-3 gap-[5px]">
          <div
            className="bg-gray-300 flex items-center justify-center aspect-square rounded-[4px]"
            onClick={handleClickCamera}
          >
            📷
          </div>
          {albumList.map((img, index) => (
            <div key={index} className="aspect-square rounded-[4px]">
              <img src={img} alt={`album-${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
