import { Button, Topbar } from '@/components/shared';
import { useNavigate } from 'react-router-dom';
import { DraftPosts } from './DraftPosts';

interface WriteProps {
  onNext: () => void;
}

export const Write = ({ onNext }: WriteProps) => {
  const navigate = useNavigate();

  const handleNewPost = () => {
    onNext();
  };

  const handleClickCancleButton = () => {
    navigate('/community');
  };

  return (
    <div className="font-roboto">
      <Topbar title="Write a Post" type="cancel" onCancle={handleClickCancleButton} />
      <div className="mt-[72px] px-4">
        <Button variant="solid" color="primary" className="mt-6 w-full h-12" onClick={handleNewPost}>
          Create a new post
        </Button>
      </div>
      <DraftPosts onNext={onNext} />
    </div>
  );
};
