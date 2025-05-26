import { StackNavigation } from 'j-react-stack';
import { TypeCategory } from '@/components/community/post';

export const CommunityEditPage = () => {
  return (
    <StackNavigation
      className="h-[calc(100vh-64px)] overflow-y-hidden"
      initialStack={[
        {
          key: 'write',
          element: <TypeCategory />,
        },
      ]}
    />
  );
};
