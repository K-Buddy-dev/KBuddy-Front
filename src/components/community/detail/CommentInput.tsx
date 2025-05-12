import { useState } from 'react';

import defaultImg from '@/assets/images/default-profile.png';

interface CommentInputProps {
  onCommentSubmit: (description: string) => void;
}

export const CommentInput = ({ onCommentSubmit }: CommentInputProps) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    if (commentText.trim()) {
      onCommentSubmit(commentText);
      setCommentText('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-border-weak1 p-4">
      <div className="flex items-center gap-2">
        <img src={defaultImg} alt="Profile" className="w-8 h-8 rounded-full" />
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Type comment"
          className="flex-1 p-2 border border-border-default rounded-lg text-sm"
        />
        <button onClick={handleSubmit} className="px-4 py-2 bg-bg-brand-default text-white rounded-lg text-sm">
          Send
        </button>
      </div>
    </div>
  );
};
