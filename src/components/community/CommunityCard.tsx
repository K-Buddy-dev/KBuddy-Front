// import { CategoryMap } from '@/types/blog';
import { Actions, Content } from './card';

interface CommunityCardProps {
  writerUuid?: string;
  writerName: string;
  writerProfileImageUrl: string;
  createdAt: string;
  title: string;
  categoryId: number[] | number;
  thumbnailImageUrl: string;
  heartCount: number;
  comments: number;
  isBookmarked: boolean;
  isHearted: boolean;
  onLike: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onBookmark: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  writerName,
  createdAt,
  title,
  categoryId,
  writerProfileImageUrl,
  thumbnailImageUrl,
  heartCount,
  comments,
  isBookmarked,
  isHearted,
  onLike,
  onBookmark,
}) => {
  return (
    <div className="w-full px-4 py-[18px] bg-bg-default rounded-lg">
      <Content
        writerName={writerName}
        date={createdAt}
        profileImageUrl={writerProfileImageUrl}
        title={title}
        categoryId={categoryId}
        imageUrl={thumbnailImageUrl}
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
