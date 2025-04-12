import { useEffect } from 'react';
import { Complete, TitleImageDescription, Write, TypeCategory } from '@/components/community/post';
import { useCommunityFormActionContext, useStackActionContext } from '@/hooks';
import { Activity } from '@/types';
import { StackRenderer } from '@/components/shared/stack/StackRenderer';

const CommunityPostPage = () => {
  const { push, pop, init } = useStackActionContext();
  const { reset } = useCommunityFormActionContext();

  useEffect(() => {
    const getActivity = (key: string): Activity => {
      switch (key) {
        case 'write':
          return {
            key: 'write',
            element: <Write onNext={() => push(getActivity('typeCategory'))} />,
          };
        case 'typeCategory':
          return {
            key: 'typeCategory',
            element: (
              <TypeCategory
                onNext={() => push(getActivity('description'))}
                onExit={() => {
                  pop();
                  reset();
                }}
              />
            ),
          };
        case 'description':
          return {
            key: 'description',
            element: <TitleImageDescription onNext={() => push(getActivity('complete'))} onExit={() => pop()} />,
          };
        case 'complete':
          return {
            key: 'complete',
            element: <Complete />,
          };
        default:
          throw new Error(`Unknown activity key: ${key}`);
      }
    };

    init([getActivity('write')]);

    const handlePopState = () => {
      pop();
    };

    window.addEventListener('popstate', handlePopState);
    window.history.replaceState({ step: 0 }, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return <StackRenderer />;
};

export default CommunityPostPage;
