import { Comment } from '@/components/shared/icon/Icon';
import { FaRegHeart, FaRegBookmark, FaHeart, FaBookmark } from 'react-icons/fa';

interface ActionsProps {
  heartCount: number;
  isHearted: boolean;
  comments: number;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
}

export const Actions: React.FC<ActionsProps> = ({
  heartCount,
  isHearted,
  comments,
  isBookmarked,
  onLike,
  onBookmark,
}) => {
  return (
    <div className="flex items-center justify-end gap-4 mt-1">
      <div className="flex items-center justify-start gap-1">
        {/* 좋아요 버튼 */}
        <div className="flex items-center gap-1">
          <button onClick={onLike} className="transition-colors hover:[&>svg]:text-red-500">
            {isHearted ? (
              <FaHeart className="w-4 h-4 text-red-500 fill-current" />
            ) : (
              <FaRegHeart className="w-4 h-4 text-text-weak stroke-current" />
            )}
          </button>
          <span className="text-sm">{heartCount}</span>
        </div>

        {/* 댓글 */}
        <div className="flex items-center gap-1 text-text-weak">
          <Comment />
          <span className="text-sm">{comments}</span>
        </div>
      </div>

      {/* 북마크 버튼 */}
      <button onClick={onBookmark} className="flex items-center transition-colors hover:[&>svg]:text-[#6952F9]">
        {isBookmarked ? (
          <FaBookmark className="w-4 h-4 text-[#6952F9] fill-current" />
        ) : (
          <FaRegBookmark className="w-4 h-4 text-text-weak stroke-current" />
        )}
      </button>
    </div>
  );
};
