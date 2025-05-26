import { Comment } from '@/types';
import { CommentItem } from './CommentItem';
import { Dispatch, SetStateAction } from 'react';

interface CommentListProps {
  comments: Comment[];
  handleCommentLike:
    | ((event: React.MouseEvent, id: number, isHearted: boolean) => void)
    | ((event: React.MouseEvent) => void);
  handleDelete: (id: number) => void;
  replyId: null | number;
  setReplyId: Dispatch<SetStateAction<null | number>>;
  editId: null | number;
  setEditId: Dispatch<SetStateAction<null | number>>;
  setEditText: Dispatch<SetStateAction<null | string>>;
}

export const CommentList = ({
  comments,
  handleCommentLike,
  handleDelete,
  replyId,
  setReplyId,
  editId,
  setEditId,
  setEditText,
}: CommentListProps) => {
  return (
    <div>
      {comments.map((comment) => {
        return comment.replies.length > 0 ? (
          <div key={`comment-${comment.id}`}>
            <CommentItem
              setEditText={setEditText}
              editId={editId}
              setEditId={setEditId}
              handleDelete={handleDelete}
              replyId={replyId}
              setReplyId={setReplyId}
              comment={comment}
              handleCommentLike={handleCommentLike}
              reply={false}
            />
            {comment.replies.map((recomment) => (
              <CommentItem
                setEditText={setEditText}
                editId={editId}
                setEditId={setEditId}
                handleDelete={handleDelete}
                replyId={replyId}
                setReplyId={setReplyId}
                key={`reply-${recomment.id}`}
                comment={recomment}
                handleCommentLike={handleCommentLike}
                reply={true}
              />
            ))}
          </div>
        ) : (
          <CommentItem
            setEditText={setEditText}
            editId={editId}
            setEditId={setEditId}
            handleDelete={handleDelete}
            replyId={replyId}
            setReplyId={setReplyId}
            key={`comment-${comment.id}`}
            comment={comment}
            handleCommentLike={handleCommentLike}
            reply={false}
          />
        );
      })}
    </div>
  );
};
