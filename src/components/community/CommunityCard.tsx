// import { CategoryMap } from '@/types/blog';
import { Actions, Content } from './card';

interface CommunityCardProps {
  userId: string;
  date: string;
  title: string;
  category: string[];
  imageUrl?: string;
  profileImageUrl?: string;
  likes: number;
  comments: number;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  userId,
  date,
  title,
  // category,
  imageUrl,
  profileImageUrl,
  likes,
  comments,
  isBookmarked,
  onLike,
  onBookmark,
}) => {
  // const categoryNames = category.map((id) => CategoryMap[id] || 'Unknown');

  return (
    <div className="w-full px-4 py-[18px]">
      <Content
        id={userId}
        date={date}
        profileImageUrl={profileImageUrl}
        title={title}
        category={[1]}
        imageUrl={imageUrl}
      />
      <Actions likes={likes} comments={comments} isBookmarked={isBookmarked} onLike={onLike} onBookmark={onBookmark} />
    </div>
  );
};
