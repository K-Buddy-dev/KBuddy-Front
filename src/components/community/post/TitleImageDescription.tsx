import { Topbar } from '@/components/shared';
import { Description } from './Description';
import { Title } from './Title';
import { Images } from './Images';
import { useCommunityFormStateContext } from '@/hooks';
import { usePost } from '@/hooks/usePost';

interface PreviewProps {
  onNext: () => void;
  onExit: () => void;
}

export const TitleImageDescription = ({ onNext, onExit }: PreviewProps) => {
  const { title, description, file, type, categoryId } = useCommunityFormStateContext();
  const { createPost } = usePost();

  const isValid = title.length > 0 && description.length > 0;

  const onSubmit = async () => {
    try {
      const data = {
        title,
        description,
        file,
        type,
        categoryId,
      };
      await createPost(data, 'PUBLISHED');
      onNext();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

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
