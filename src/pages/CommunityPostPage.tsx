import { StackNavigation } from 'j-react-stack';
import { Write } from '@/components/community/post';

export const CommunityPostPage = () => {
  return (
    <StackNavigation
      className="h-[calc(100vh-64px)] overflow-y-hidden"
      initialStack={[
        {
          key: 'write',
          element: <Write />,
        },
      ]}
    />
  );
};
