import { StackNavigation } from 'j-react-stack';
import { Write } from '@/components/community/post';

const CommunityPostPage = () => {
  return (
    <StackNavigation
      initialStack={[
        {
          key: 'write',
          element: <Write />,
        },
      ]}
    />
  );
};

export default CommunityPostPage;
