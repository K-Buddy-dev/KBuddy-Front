import { Topbar } from '@/components/shared';
import { Description } from '../components/community/post/Description';
import { Title } from '../components/community/post/Title';
import { Images } from '../components/community/post/Images';
import { PostStepHeader } from '../components/community/post/PostStepHeader';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { usePost } from '@/hooks/usePost';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const TitleImageDescriptionPage = () => {
  const navigate = useNavigate();
  const { title, description, images, type, categoryId, draftId, isDraftMode, isEditMode, originalType } =
    useCommunityFormStateContext();
  const { createPost, updatePost, isLoading } = usePost();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { reset } = useCommunityFormActionContext();
  const isValid = title.length > 0 && description.length > 0;
  const contentCopy =
    type === 'Q&A'
      ? {
          description: 'Describe your question clearly so community members can give useful answers.',
          helper: 'Add details so others can understand your situation.',
          placeholder: 'Example: How can I extend my visa in Korea?',
          title: 'What do you need help with?',
        }
      : {
          description: 'Turn your experience into a helpful post for people planning life in Korea.',
          helper: 'Add practical details, personal tips, and anything readers should know.',
          placeholder: 'Example: 5 things I wish I knew before moving to Seoul',
          title: 'What is your post about?',
        };

  const onSubmit = async () => {
    try {
      const data = {
        title,
        description,
        images,
        type,
        categoryId,
      };

      if (isDraftMode && draftId) {
        // 타입이 변경되었고 원본 타입이 있는 경우 originalType을 전달
        if (originalType && originalType !== type) {
          await updatePost(draftId, data, originalType);
        } else {
          await updatePost(draftId, data);
        }
      } else {
        await createPost(data, 'PUBLISHED');
      }

      // 이미지 URL 메모리 정리
      imageUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      setImageUrls([]);
      localStorage.removeItem('community-current-step');
      reset();

      navigate('/community/post/complete');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const onBack = () => {
    navigate(-1);
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
      <Topbar
        title={`${isEditMode ? 'Edit Post' : 'New Post'}`}
        type="back"
        next="Post"
        isNext={isValid && !isLoading}
        onBack={onBack}
        onNext={onSubmit}
      />
      <PostStepHeader step={3} title="Write your post" description={contentCopy.description} />
      <div className="pb-8">
        <Title label={contentCopy.title} placeholder={contentCopy.placeholder} />
        <Images imageUrls={imageUrls} setImageUrls={setImageUrls} />
        <section className="px-4 pt-5">
          <h2 className="text-lg font-semibold text-text-default">Details</h2>
          <p className="mt-1 text-sm leading-5 text-text-weak">{contentCopy.helper}</p>
        </section>
        <Description />
      </div>
    </div>
  );
};
