// import { CategoryMap } from '@/types/blog';
import { Actions, Content } from './card';

interface CommunityCardProps {
  writerId: string;
  createdAt: string;
  title: string;
  categoryId: number[];
  imageUrl?: string;
  profileImageUrl?: string;
  heartCount: number;
  comments: number;
  isBookmarked: boolean;
  isHearted: boolean;
  onLike: () => void;
  onBookmark: () => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  writerId,
  createdAt,
  title,
  categoryId,
  imageUrl,
  profileImageUrl,
  heartCount,
  comments,
  isBookmarked,
  isHearted,
  onLike,
  onBookmark,
}) => {
  // const categoryNames = category.map((id) => CategoryMap[id] || 'Unknown');

  return (
    <div className="w-full px-4 py-[18px] bg-bg-default rounded-lg">
      <Content
        id={writerId}
        date={createdAt}
        profileImageUrl={profileImageUrl}
        title={title}
        categoryId={categoryId}
        imageUrl={imageUrl}
      />
      <Actions
        heartCount={heartCount}
        isHearted={isHearted}
        comments={comments}
        isBookmarked={isBookmarked}
        onLike={onLike}
        onBookmark={onBookmark}
      />
    </div>
  );
};
