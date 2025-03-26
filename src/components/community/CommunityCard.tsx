import { Actions, Content, UserInfo } from './card';
import { BlogCategory } from '@/types/blog';

interface CommunityCardProps {
  userId: string;
  date: string;
  title: string;
  category: BlogCategory;
  imageUrl?: string;
  profileImageUrl?: string;
  likes: number;
  comments: number;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  userId,
  date,
  title,
  category,
  imageUrl,
  profileImageUrl,
  likes,
  comments,
  isBookmarked,
  onLike,
  onBookmark,
}) => {
  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white mb-4">
      <div className="flex-1">
        <UserInfo id={userId} date={date} profileImageUrl={profileImageUrl} />
        <Content title={title} category={category} imageUrl={imageUrl} />
        <Actions
          likes={likes}
          comments={comments}
          isBookmarked={isBookmarked}
          onLike={onLike}
          onBookmark={onBookmark}
        />
      </div>
    </div>
  );
};

export default CommunityCard;
