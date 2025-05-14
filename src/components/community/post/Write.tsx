import { Button, Topbar } from '@/components/shared';
import { useNavigate } from 'react-router-dom';
import { DraftPosts } from './DraftPosts';
import { useStackNavigation } from 'j-react-stack';
import { TypeCategory } from './TypeCategory';

export const Write = () => {
  const { push } = useStackNavigation();
  const navigate = useNavigate();

  const onNext = () => {
    push({
      key: 'typeCategory',
      element: <TypeCategory />,
    });
  };

  const handleClickCancleButton = () => {
    navigate('/community');
  };

  return (
    <div className="font-roboto w-full min-h-[calc(100vh-64px)] pt-20">
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
