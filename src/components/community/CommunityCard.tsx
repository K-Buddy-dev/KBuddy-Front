import { Actions, Content } from './card';
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
    <div className="w-full px-4 py-[18px]">
      <Content
        id={userId}
        date={date}
        profileImageUrl={profileImageUrl}
        title={title}
        category={category}
        imageUrl={imageUrl}
      />
      <Actions likes={likes} comments={comments} isBookmarked={isBookmarked} onLike={onLike} onBookmark={onBookmark} />
    </div>
  );
};

export default CommunityCard;
