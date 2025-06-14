import { Button, Topbar } from '@/components/shared';
import { useNavigate } from 'react-router-dom';
import { DraftPosts } from './DraftPosts';

export const Write = () => {
  const navigate = useNavigate();

  const onNext = () => {
    navigate('/community/post/type-category');
  };

  const handleClickCancleButton = () => {
    navigate('/community');
  };

  return (
    <div className="font-roboto w-full min-h-screen pt-20">
      <Topbar title="Write a Post" type="cancel" onCancle={handleClickCancleButton} />
      <div className="px-4">
        <Button variant="solid" color="primary" className="mt-6 w-full h-12" onClick={onNext}>
          Create a new post
        </Button>
      </div>
      <DraftPosts onNext={onNext} />
    </div>
  );
};
