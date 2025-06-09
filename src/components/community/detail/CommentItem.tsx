import { formatRelativeDate } from '@/utils';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import defaultImg from '@/assets/images/default-profile.png';
import { Comment } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { DeletelModal } from './DeleteModal';

interface CommentItemProps {
  comment: Comment;
  handleCommentLike:
    | ((event: React.MouseEvent, id: number, isHearted: boolean) => void)
    | ((event: React.MouseEvent) => void);
  reply: boolean;
  replyId: null | number;
  setReplyId: Dispatch<SetStateAction<null | number>>;
  handleDelete: (id: number) => void;
  editId: null | number;
  setEditId: Dispatch<SetStateAction<null | number>>;
  setEditText: Dispatch<SetStateAction<null | string>>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const CommentItem = ({
  comment,
  handleCommentLike,
  reply,
  replyId,
  setReplyId,
  handleDelete,
  editId,
  setEditId,
  setEditText,
  inputRef,
}: CommentItemProps) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{ uuid: string } | null>(null);

  useEffect(() => {
    const localUserData = localStorage.getItem('basicUserData');
    if (!localUserData) {
      navigate('/');
    } else {
      setUserInfo(JSON.parse(localUserData));
    }
  }, [navigate]);

  const focusInputWithCursor = () => {
    const inputEl = inputRef?.current;
    if (inputEl) {
      inputEl.readOnly = true;
      inputEl.focus();

      setTimeout(() => {
        inputEl.readOnly = false;

        const length = inputEl.value.length;
        inputEl.setSelectionRange(length, length);
      }, 100);
    }
  };

  const handleReply = () => {
    if (replyId === null) {
      setEditId(null);
      setEditText(null);
      setReplyId(comment.id);
      requestAnimationFrame(() => {
        focusInputWithCursor();
      });
    } else {
      setEditId(null);
      setEditText(null);
      setReplyId(null);
    }
  };

  const handleEdit = () => {
    if (editId === null) {
      setReplyId(null);
      setEditId(comment.replies.length > 0 ? comment.id : comment.id);
      setEditText(comment.description);
      requestAnimationFrame(() => {
        focusInputWithCursor();
      });
    } else {
      setEditId(null);
      setEditText(null);
      setReplyId(null);
    }
  };

  const isMyComment = userInfo?.uuid === String(comment.writerUuid);
  return (
    <div className={`flex items-start gap-2 mb-4 ${reply ? ' ml-8' : ' ml-0'}`}>
      {showDeleteModal && (
        <DeletelModal commentId={comment.id} deleteMutate={handleDelete} setShowDeleteModal={setShowDeleteModal} />
      )}
      <img
        src={comment.writerProfileImageUrl ? comment.writerProfileImageUrl : defaultImg}
        alt="Profile"
        className="w-[28px] h-[28px] rounded-full"
      />
      <div className="font-roboto flex-1">
        <div
          className={`p-3 rounded-xl ${replyId === comment.id ? ' bg-red-100/50' : ' bg-bg-default'} ${editId === comment.id ? ' bg-blue-100/50' : ' bg-bg-default'}`}
        >
          <div className="flex justify-start items-center text-text-weak">
            <span className="text-xs font-medium border-r-[1px] border-solid border-border-default pr-2">
              @{comment.writerName}
            </span>
            <span className="text-xs pl-2">{formatRelativeDate(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-text-default mt-1">{comment.description}</p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center justify-start gap-1">
            <button
              className="w-full cursor-pointer group"
              onClick={(event) => handleCommentLike(event, comment.id, comment.isHearted)}
            >
              <div className="transition-colors group-hover:[&>svg]:text-red-500">
                {comment.isHearted ? (
                  <FaHeart className="w-5 h-5 text-red-500 fill-current" />
                ) : (
                  <FaRegHeart className="w-5 h-5 text-text-default stroke-current" />
                )}
              </div>
            </button>
            <span className="text-sm font-medium text-text-default cursor-default">{comment.heartCount}</span>
          </div>
          <div className="text-sm font-medium cursor-pointer flex items-center gap-2">
            {!reply && (
              <button onClick={handleReply} className="text-text-default ">
                Reply
              </button>
            )}
            {isMyComment && (
              <div className="flex items-center gap-2">
                <button onClick={handleEdit} className="text-text-brand-default">
                  Edit
                </button>
                <button onClick={() => setShowDeleteModal(true)} className="text-text-danger-default">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
