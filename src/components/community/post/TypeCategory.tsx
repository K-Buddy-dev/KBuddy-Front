import { Topbar } from '@/components/shared';
import { DraftModal } from './DraftModal';
import { useEffect, useState } from 'react';
import { CategorySelector } from './CategorySelector';
import { TypeSelector } from './TypeSelector';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { useStackNavigation } from 'j-react-stack';
import { TitleImageDescription } from './TitleImageDescription';

export const TypeCategory = () => {
  const { push, pop } = useStackNavigation();
  const { reset } = useCommunityFormActionContext();
  const { type, categoryId } = useCommunityFormStateContext();
  const [showExitModal, setShowExitModal] = useState(false);

  const onExit = () => {
    pop();
    reset();
  };

  const onNext = () => {
    push({
      key: 'description',
      element: <TitleImageDescription />,
    });
  };

  const handleClickBackButton = () => {
    if (type && categoryId.length > 0) {
      setShowExitModal(true);
    } else {
      onExit();
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="font-roboto w-full min-h-[calc(100vh-64px)] pt-20">
      <Topbar title="Post Preview" type="back" isNext={true} onBack={handleClickBackButton} />
      {/* <div className="bg-bg-medium w-full h-[326px] mt-14 px-4">
        <SectionInfo
          title="Post Preview"
          description="Here's a sneak peek of how your blog preview will look once it's published in the community space."
        />
      </div> */}
      <TypeSelector />
      <CategorySelector onNext={onNext} />
      {showExitModal && <DraftModal onExit={onExit} setShowExitModal={setShowExitModal} />}
    </div>
  );
};
