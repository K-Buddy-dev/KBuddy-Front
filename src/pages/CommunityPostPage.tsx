import { useState, useEffect } from 'react';
import { Complete, Description, Title, Write, Preview } from '@/components/community/post';
import { useCommunityFormActionContext } from '@/hooks';

const CommunityPostPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const savedStep = sessionStorage.getItem('community-current-step');
    return savedStep ? parseInt(savedStep, 10) : 0;
  });

  const [isPostCompleted, setIsPostCompleted] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('community-post-completed');
    return saved ? JSON.parse(saved) : false;
  });

  const { setFile } = useCommunityFormActionContext();

  const handleImageSelection = () => {
    if (window.ReactNativeWebView) {
      // 모바일에서 앨범 선택
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'getAlbum' }));
    } else {
      // 데스크탑에서 파일 선택
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;

      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const files = Array.from(target.files);
          setFile(files);
          setCurrentStep(2);
        }
      };

      input.click();
    }
  };

  // localStorage에 저장
  useEffect(() => {
    sessionStorage.setItem('community-current-step', currentStep.toString());
    window.history.pushState({ step: currentStep }, '', window.location.href);
  }, [currentStep]);

  useEffect(() => {
    sessionStorage.setItem('community-post-completed', JSON.stringify(isPostCompleted));
  }, [isPostCompleted]);

  // 뒤로가기 이벤트 처리
  useEffect(() => {
    const handlePopState = () => {
      setCurrentStep((prev) => Math.max(0, prev - 1));
    };

    const handleMessage = (event: MessageEvent) => {
      console.log('RN 수신 데이터: ', event.data);
      if (typeof event.data !== 'string') return;

      try {
        const data = JSON.parse(event.data);
        console.log('JSON parsed 데이터: ', data);
        if (data.action === 'albumData') {
          console.log('앨범 데이터 수신: ', data.album);

          // Base64 URI를 File 객체로 변환
          const base64ToFile = (base64String: string, fileName: string): File => {
            const byteCharacters = atob(base64String.split(',')[1]);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
              const slice = byteCharacters.slice(offset, offset + 1024);
              const byteNumbers = new Array(slice.length);

              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }

              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: 'image/jpeg' });
            return new File([blob], fileName, { type: 'image/jpeg' });
          };

          // 첫 번째 이미지를 File 객체로 변환
          if (data.album && data.album.length > 0) {
            const file = base64ToFile(data.album[0], 'selected-image.jpg');
            setFile([file]);
          }
        }
      } catch (e) {
        console.error('앨범 데이터 파싱 실패:', e);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('message', handleMessage);
    window.history.replaceState({ step: currentStep }, '', window.location.href);

    return () => {
      window.removeEventListener('message', handleMessage);
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
        setIsPostCompleted(true);
        setCurrentStep(4);
      }}
      onExit={() => setCurrentStep(2)}
    />,
    isPostCompleted ? (
      <Complete
        key="complete"
        // onBack={() => {
        //   setCurrentStep(0);
        //   setIsPostCompleted(false);
        // }}
      />
    ) : (
      <Write key="write" onNext={() => setCurrentStep(1)} />
    ),
  ];

  return <div className="w-full">{steps[currentStep]}</div>;
};

export default CommunityPostPage;
