import { Comment } from '@/components/shared/icon/Icon';
import { FaRegHeart, FaRegBookmark, FaHeart, FaBookmark } from 'react-icons/fa';

interface ActionsProps {
  likes: number;
  comments: number;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
}

export const Actions: React.FC<ActionsProps> = ({ likes, comments, isBookmarked, onLike, onBookmark }) => {
  return (
    <div className="flex items-center justify-end gap-4 mt-1">
      <div className="flex items-center justify-start gap-1">
        {/* 좋아요 버튼 */}
        <button onClick={onLike} className="flex items-center gap-1 text-gray-900 hover:text-red-500 transition-colors">
          {likes > 0 ? (
            <FaHeart className="w-4 h-4 text-red-500 fill-current" />
          ) : (
            <FaRegHeart className="w-4 h-4 text-gray-900 stroke-current" />
          )}
          <span className="text-sm">{likes}</span>
        </button>

        {/* 댓글 */}
        <div className="flex items-center gap-1 text-gray-900">
          <Comment />
          <span className="text-sm">{comments}</span>
        </div>
      </div>

      {/* 북마크 버튼 */}
      <button onClick={onBookmark} className="flex items-center text-gray-900 hover:text-[#6952F9] transition-colors">
        {isBookmarked ? (
          <FaBookmark className="w-4 h-4 text-[#6952F9] fill-current" />
        ) : (
          <FaRegBookmark className="w-4 h-4 text-gray-900 stroke-current" />
        )}
      </button>
    </div>
  );
};
