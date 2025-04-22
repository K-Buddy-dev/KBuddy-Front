import { Topbar } from '@/components/shared';
import { Description } from './Description';
import { Title } from './Title';
import { Images } from './Images';
import { useCommunityFormStateContext } from '@/hooks';
import { usePost } from '@/hooks/usePost';
import { useEffect } from 'react';

interface PreviewProps {
  onNext: () => void;
  onExit: () => void;
}

export const TitleImageDescription = ({ onNext, onExit }: PreviewProps) => {
  const { title, description, images, type, categoryId, draftId, isEditMode, originalType } =
    useCommunityFormStateContext();
  const { createPost, updatePost } = usePost();

  const isValid = title.length > 0 && description.length > 0;

  const onSubmit = async () => {
    try {
      const data = {
        title,
        description,
        images,
        type,
        categoryId,
      };

      if (isEditMode && draftId) {
        // 타입이 변경되었고 원본 타입이 있는 경우 originalType을 전달
        if (originalType && originalType !== type) {
          await updatePost(draftId, data, originalType);
        } else {
          await updatePost(draftId, data);
        }
      } else {
        await createPost(data, 'PUBLISHED');
      }

      onNext();
    } catch (error) {
      console.error('Error submitting form:', error);
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
    <div className="font-roboto">
      <Topbar title="New Post" type="back" next="Post" isNext={isValid} onBack={onExit} onNext={onSubmit} />
      <div className="mt-[72px]">
        <Title />
        <Images />
        <Description />
      </div>
    </div>
  );
};
