import { Button, Topbar } from '@/components/shared';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompleteImage from '@/assets/images/post/post_success.png';
import { useCommunityFormActionContext } from '@/hooks';

export const Complete = () => {
  const navigate = useNavigate();
  const { reset } = useCommunityFormActionContext();

  useEffect(() => {
    localStorage.removeItem('community-current-step');
    reset();
  }, []);

  return (
    <div className="w-full min-h-screen pt-20">
      <Topbar title="" type="cancel" onCancle={() => navigate('/community')} />
      <div className="w-full min-h-[calc(100vh-80px)] flex justify-center items-center">
        <div className="w-full min-h-[640px] px-4 flex flex-col items-center">
          <div className="w-36 h-36 rounded-full bg-bg-brand-weak mb-3">
            <img src={CompleteImage} alt="complete" />
          </div>
          <h1 className="text-text-default font-medium text-base mb-[2px]">Congrats!</h1>
          <p className="text-text-weak font-normal text-sm mb-10">You've successfully submitted a post.</p>
          <Button className="w-full" onClick={() => navigate('/community')}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};
