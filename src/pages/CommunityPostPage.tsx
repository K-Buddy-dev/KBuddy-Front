import { useEffect } from 'react';
import { Complete, Description, Title, Write, Preview } from '@/components/community/post';
import { useCommunityFormActionContext, useStackActionContext } from '@/hooks';
import { base64ToFile } from '@/utils/utils';
import { Activity } from '@/types';
import { StackRenderer } from '@/components/shared/stack/StackRenderer';

const CommunityPostPage = () => {
  const { push, pop, init } = useStackActionContext();
  const { setFile } = useCommunityFormActionContext();

  const handleAlbumDataFromRN = (event: MessageEvent) => {
    console.log('RN 수신 데이터: ', event.data);
    if (typeof event.data !== 'string') return;

    try {
      const data = JSON.parse(event.data);
      console.log('JSON parsed 데이터: ', data);
      if (data.action === 'albumData') {
        console.log('앨범 데이터 수신: ', data.album);

        // 모든 이미지를 File 객체로 변환
        if (data.album && data.album.length > 0) {
          const files = data.album.map((base64: string, index: number) =>
            base64ToFile(base64, `selected-image-${index}.jpg`)
          );
          setFile(files);
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
        setFile(files);
      }
    };

    input.click();
  };

  const handleImageSelection = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'getAlbum' }));
    } else {
      handleWebFileSelection();
    }
  };

  useEffect(() => {
    const getActivity = (key: string): Activity => {
      switch (key) {
        case 'write':
          return {
            key: 'write',
            element: <Write onNext={() => push(getActivity('title'))} />,
          };
        case 'title':
          return {
            key: 'title',
            element: (
              <Title
                onNext={() => {
                  handleImageSelection();
                  push(getActivity('description'));
                }}
                onExit={() => pop()}
              />
            ),
          };
        case 'description':
          return {
            key: 'description',
            element: <Description onNext={() => push(getActivity('preview'))} onExit={() => pop()} />,
          };
        case 'preview':
          return {
            key: 'preview',
            element: <Preview onNext={() => push(getActivity('complete'))} onExit={() => pop()} />,
          };
        case 'complete':
          return {
            key: 'complete',
            element: <Complete />,
          };
        default:
          throw new Error(`Unknown activity key: ${key}`);
      }
    };

    init([getActivity('write')]);

    const handlePopState = () => {
      pop();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('message', handleAlbumDataFromRN);
    window.history.replaceState({ step: 0 }, '', window.location.href);

    return () => {
      window.removeEventListener('message', handleAlbumDataFromRN);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return <StackRenderer />;
};

export default CommunityPostPage;
