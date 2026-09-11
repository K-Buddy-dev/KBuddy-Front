import { Topbar } from '@/components/shared';
import { DraftModal } from '../components/community/post/DraftModal';
import { useEffect, useState } from 'react';
import { CategorySelector } from '../components/community/post/CategorySelector';
import { PostStepHeader } from '../components/community/post/PostStepHeader';
import { TypeSelector } from '../components/community/post/TypeSelector';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PostFormType } from '@/types';

const POST_FORM_TYPES: PostFormType[] = ['Blog', 'Buddy', 'Q&A'];

export const TypeCategoryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { reset, setCategoryId, setType } = useCommunityFormActionContext();
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

  useEffect(() => {
    const requestedType = searchParams.get('type') as PostFormType | null;

    if (!isEditMode && requestedType && POST_FORM_TYPES.includes(requestedType) && requestedType !== type) {
      setType(requestedType);
      setCategoryId([]);
    }
  }, [isEditMode, searchParams, setCategoryId, setType, type]);

  return (
    <div className="font-roboto w-full min-h-screen pt-20">
      <Topbar title={isEditMode ? 'Edit Post' : 'New Post'} type="back" isNext={true} onBack={handleClickBackButton} />
      <PostStepHeader
        step={1}
        title="Choose what you want to create"
        description="Start with the format, then choose the tags that help the right people find your post."
      />
      <TypeSelector />
      <CategorySelector onNext={onNext} />
      {showExitModal && <DraftModal onExit={isEditMode ? onEditExit : onExit} setShowExitModal={setShowExitModal} />}
    </div>
  );
};
