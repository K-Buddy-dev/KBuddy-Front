import { useState } from 'react';
import { useCommunityFormStateContext, useCommunityFormActionContext } from '@/hooks/useCommunityFormContext';

interface FormProps {
  onNext: () => void;
  onExit: () => void;
}

export const Form = ({ onNext, onExit }: FormProps) => {
  const { title, description, file, hashtags } = useCommunityFormStateContext();
  console.log('file: ', file);
  const { setTitle, setDescription, setFile, setHashtags, addDraft } = useCommunityFormActionContext();
  const [showExitModal, setShowExitModal] = useState(false);

  const handleSave = () => {
    addDraft();
    onExit();
  };

  const handleDelete = () => {
    setTitle('');
    setDescription('');
    setFile([]);
    setHashtags([]);
    onExit();
  };

  return (
    <div>
      <h2>글 작성</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input type="file" multiple onChange={(e) => setFile(e.target.files ? Array.from(e.target.files) : [])} />
      <input
        value={hashtags.join(',')}
        onChange={(e) => setHashtags(e.target.value.split(',').map((tag) => tag.trim()))}
        placeholder="Hashtags (comma separated)"
      />
      <button onClick={() => setShowExitModal(true)}>나가기</button>
      <button disabled={!title || !description} onClick={onNext}>
        Next
      </button>
      {showExitModal && (
        <div>
          <button onClick={handleSave}>저장</button>
          <button onClick={handleDelete}>삭제</button>
          <button onClick={onExit}>돌아가기</button>
          <button onClick={() => setShowExitModal(false)}>취소</button>
        </div>
      )}
    </div>
  );
};
