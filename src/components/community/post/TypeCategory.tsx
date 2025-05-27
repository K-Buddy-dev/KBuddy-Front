import { Topbar } from '@/components/shared';
import { DraftModal } from './DraftModal';
import { useEffect, useState } from 'react';
import { CategorySelector } from './CategorySelector';
import { TypeSelector } from './TypeSelector';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { useStackNavigation } from 'j-react-stack';
import { TitleImageDescription } from './TitleImageDescription';
import { useNavigate } from 'react-router-dom';

export const TypeCategory = () => {
  const navigate = useNavigate();
  const { push, pop } = useStackNavigation();
  const { reset } = useCommunityFormActionContext();
  const { type, categoryId, detailBackUrl, isEditMode } = useCommunityFormStateContext();
  const [showExitModal, setShowExitModal] = useState(false);

  const onExit = () => {
    pop();
    reset();
  };

  const onEditExit = () => {
    pop();
    navigate(`${detailBackUrl}`, { replace: true });
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
    <div className="font-roboto w-full min-h-screen pt-20">
      <Topbar title="Post Preview" type="back" isNext={true} onBack={handleClickBackButton} />
      {/* <div className="bg-bg-medium w-full h-[326px] mt-14 px-4">
        <SectionInfo
          title="Post Preview"
          description="Here's a sneak peek of how your blog preview will look once it's published in the community space."
        />
      </div> */}
      <TypeSelector />
      <CategorySelector onNext={onNext} />
      {showExitModal && <DraftModal onExit={isEditMode ? onEditExit : onExit} setShowExitModal={setShowExitModal} />}
    </div>
  );
};
