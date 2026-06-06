import { Topbar } from '@/components/shared';
import { DraftModal } from '../components/community/post/DraftModal';
import { useEffect, useState } from 'react';
import { CategorySelector } from '../components/community/post/CategorySelector';
import { PostStepHeader } from '../components/community/post/PostStepHeader';
import { TypeSelector } from '../components/community/post/TypeSelector';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { useNavigate } from 'react-router-dom';

export const TypeCategoryPage = () => {
  const navigate = useNavigate();
  const { reset } = useCommunityFormActionContext();
  const { type, categoryId, isEditMode } = useCommunityFormStateContext();
  const [showExitModal, setShowExitModal] = useState(false);

  const onExit = () => {
    navigate(-1);
    reset();
  };

  const onEditExit = () => {
    navigate(-1);
  };

  const onNext = () => {
    navigate('/community/post/title-image-description');
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
      <Topbar title={isEditMode ? 'Edit Post' : 'New Post'} type="back" isNext={true} onBack={handleClickBackButton} />
      <PostStepHeader
        step={1}
        title="Choose what you want to create"
        description="Start with the format, then choose the category that helps the right people find your post."
      />
      <TypeSelector />
      <CategorySelector onNext={onNext} />
      {showExitModal && <DraftModal onExit={isEditMode ? onEditExit : onExit} setShowExitModal={setShowExitModal} />}
    </div>
  );
};
