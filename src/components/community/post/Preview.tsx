import { useState } from 'react';
import { useCommunityFormStateContext, useCommunityFormActionContext } from '@/hooks/useCommunityFormContext';

interface PreviewProps {
  onNext: () => void;
  onBack: () => void;
}

export const Preview = ({ onNext, onBack }: PreviewProps) => {
  const { title, description, file } = useCommunityFormStateContext();
  const { setCategoryId } = useCommunityFormActionContext();
  const [type, setType] = useState<'blog' | 'qna' | ''>('');
  const [categoryId, setLocalCategoryId] = useState<number>(0);

  const handleSubmit = () => {
    setCategoryId(categoryId);
    const postData = {
      categoryId,
      title,
      description,
      file,
      type,
    };
    console.log(postData);
    // 서버에 저장
    // await api.post('/posts', postData);
    onNext();
  };

  return (
    <div>
      <h2>Preview</h2>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <p>Files: {file.map((f) => f.name).join(', ')}</p>
      </div>
      <select value={type} onChange={(e) => setType(e.target.value as 'blog' | 'qna')}>
        <option value="">Type</option>
        <option value="blog">Blog</option>
        <option value="qna">Q&A</option>
      </select>
      <input
        type="number"
        value={categoryId}
        onChange={(e) => setLocalCategoryId(parseInt(e.target.value, 10))}
        placeholder="Category ID"
      />
      <button onClick={onBack}>Back</button>
      <button disabled={!type || !categoryId} onClick={handleSubmit}>
        Complete
      </button>
    </div>
  );
};
