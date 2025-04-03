import {
  useCommunityFormStateContext,
  useCommunityFormActionContext,
  PostDraft,
} from '@/hooks/useCommunityFormContext';

interface WriteProps {
  onNext: () => void;
}

export const Write = ({ onNext }: WriteProps) => {
  const { drafts } = useCommunityFormStateContext();
  const { setCategoryId, setTitle, setDescription, setFile, setHashtags, deleteDraft, loadDraft } =
    useCommunityFormActionContext();

  const handleNewPost = () => {
    setCategoryId(0);
    setTitle('');
    setDescription('');
    setFile([]);
    setHashtags([]);
    onNext();
  };

  const handleSelectDraft = (draft: PostDraft) => {
    loadDraft(draft);
    onNext();
  };

  return (
    <div>
      <h2>Write a Post</h2>
      <button onClick={handleNewPost}>새로운 글 쓰기</button>
      {drafts.length > 0 && (
        <div>
          <h3>초안 목록</h3>
          {drafts.map((draft) => (
            <div key={draft.id}>
              <p>{draft.data.title || '제목 없음'}</p>
              <button onClick={() => handleSelectDraft(draft.data)}>이어 쓰기</button>
              <button onClick={() => deleteDraft(draft.id)}>삭제</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
