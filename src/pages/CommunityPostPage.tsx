import { useState, useEffect } from 'react';
import { CommunityFormContextProvider } from '@/components/contexts/CommunityFormContextProvider';
import { Complete, Form, Preview, Write } from '@/components/community/post';

const CommunityPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const savedStep = localStorage.getItem('community-current-step');
    return savedStep ? parseInt(savedStep, 10) : 0;
  });

  const [isPostCompleted, setIsPostCompleted] = useState<boolean>(() => {
    const saved = localStorage.getItem('community-post-completed');
    return saved ? JSON.parse(saved) : false;
  });

  // localStorage에 저장
  useEffect(() => {
    localStorage.setItem('community-current-step', currentStep.toString());
    window.history.pushState({ step: currentStep }, '', window.location.href);
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('community-post-completed', JSON.stringify(isPostCompleted));
  }, [isPostCompleted]);

  // 뒤로가기 이벤트 처리
  useEffect(() => {
    const handlePopState = () => {
      setCurrentStep((prev) => Math.max(0, prev - 1));
    };

    window.addEventListener('popstate', handlePopState);
    window.history.replaceState({ step: currentStep }, '', window.location.href);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const steps = [
    <Write key="write" onNext={() => setCurrentStep(1)} />,
    <Form key="form" onNext={() => setCurrentStep(2)} onExit={() => setCurrentStep(0)} />,
    <Preview
      key="preview"
      onNext={() => {
        setIsPostCompleted(true);
        setCurrentStep(3);
      }}
      onBack={() => setCurrentStep(1)}
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

  return (
    <CommunityFormContextProvider>
      <div>
        <h1>Community</h1>
        {steps[currentStep]}
      </div>
    </CommunityFormContextProvider>
  );
};

export default CommunityPage;
