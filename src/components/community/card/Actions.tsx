import { FaHeart, FaComment, FaBookmark } from 'react-icons/fa';

interface ActionsProps {
  likes: number;
  comments: number;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
}

export const Actions: React.FC<ActionsProps> = ({ likes, comments, isBookmarked, onLike, onBookmark }) => {
  return (
    <div className="flex items-center justify-end gap-3 mt-2">
      {/* 좋아요 버튼 */}
      <button onClick={onLike} className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors">
        <FaHeart className={`w-4 h-4 ${likes > 0 ? 'text-red-500' : 'text-gray-600'}`} />
        <span className="text-sm">{likes}</span>
      </button>

      {/* 댓글 */}
      <div className="flex items-center gap-1 text-gray-600">
        <FaComment className="w-4 h-4" />
        <span className="text-sm">{comments}</span>
      </div>

      {/* 북마크 버튼 */}
      <button onClick={onBookmark} className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
        <FaBookmark className={`w-4 h-4 ${isBookmarked ? 'text-blue-500' : 'text-gray-600'}`} />
      </button>
    </div>
  );
};
