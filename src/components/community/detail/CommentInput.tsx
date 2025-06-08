import { useEffect, useState } from 'react';

import defaultImg from '@/assets/images/default-profile.png';

interface CommentInputProps {
  editId: null | number;
  editText: null | string;
  onCommentSubmit: (description: string) => void;
  onCommentEdit: (id: number, description: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const CommentInput = ({ editId, editText, onCommentSubmit, onCommentEdit, inputRef }: CommentInputProps) => {
  const [commentText, setCommentText] = useState<string>('');
  const localUserData = localStorage.getItem('basicUserData');
  let userInfo = null;
  if (localUserData) {
    try {
      userInfo = JSON.parse(localUserData);
    } catch (error) {
      console.error('Failed to parse localStorage data:', error);
    }
  }

  const handleSubmit = () => {
    if (commentText.trim()) {
      onCommentSubmit(commentText);
      setCommentText('');
    }
  };

  const handleEdit = () => {
    if (!editId) return;

    if (commentText.trim() && commentText !== editText) {
      onCommentEdit(editId, commentText);
      setCommentText('');
    }
  };

  useEffect(() => {
    if (editText !== null) {
      setCommentText(editText);
    } else {
      setCommentText('');
    }
  }, [editText]);

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 min-w-[280px] w-full sm:w-[600px] bg-white border-t border-border-weak1 px-4 pt-3 pb-7 z-20">
      <div className="flex items-center h-10 gap-2">
        <img
          src={userInfo.profileImageUrl ? userInfo.profileImageUrl : defaultImg}
          alt="Profile"
          className="w-7 h-7 rounded-full"
        />
        <input
          ref={inputRef}
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Type comment"
          className="indent-3 flex-1 flex items-center bg-bg-medium rounded-[50px] h-[40px] font-roboto font-normal text-sm"
        />
        <button
          onClick={editText !== null ? handleEdit : handleSubmit}
          disabled={commentText.length === 0}
          className={`px-4 py-2 ${commentText.length === 0 ? ' bg-bg-brand-weak' : ' bg-bg-brand-default'} text-white rounded-lg text-sm`}
        >
          {editText !== null ? 'Edit' : 'Send'}
        </button>
      </div>
    </div>
  );
};
