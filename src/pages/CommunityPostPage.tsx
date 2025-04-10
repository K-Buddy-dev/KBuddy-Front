import { useState, useEffect } from 'react';
import { Complete, Description, Title, Write, Preview } from '@/components/community/post';
import { useCommunityFormActionContext } from '@/hooks';
import { base64ToFile } from '@/utils/utils';

const CommunityPostPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const savedStep = localStorage.getItem('community-current-step');
    return savedStep ? parseInt(savedStep, 10) : 0;
  });
  const { setFile } = useCommunityFormActionContext();

  const handleRNAlbumMessage = (event: MessageEvent) => {
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

  const handleImageSelection = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'getAlbum' }));
    } else {
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
    }
    setCurrentStep(2);
  };

  useEffect(() => {
    localStorage.setItem('community-current-step', currentStep.toString());
    window.history.pushState({ step: currentStep }, '', window.location.href);
  }, [currentStep]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentStep((prev) => Math.max(0, prev - 1));
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('message', handleRNAlbumMessage);
    window.history.replaceState({ step: currentStep }, '', window.location.href);

    return () => {
      window.removeEventListener('message', handleRNAlbumMessage);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const steps = [
    <Write key="write" onNext={() => setCurrentStep(1)} />,
    <Title key="title" onNext={() => handleImageSelection()} onExit={() => setCurrentStep(0)} />,
    <Description
      key="description"
      onNext={() => {
        setCurrentStep(3);
      }}
      onExit={() => setCurrentStep(0)}
    />,
    <Preview
      key="preview"
      onNext={() => {
        setCurrentStep(4);
      }}
      onExit={() => setCurrentStep(2)}
    />,
    <Complete key="complete" />,
  ];

  return <div className="w-full">{steps[currentStep]}</div>;
};

export default CommunityPostPage;
