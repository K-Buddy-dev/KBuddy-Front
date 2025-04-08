import { useState } from 'react';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks/useCommunityFormContext';
import { TextField, Topbar } from '@/components/shared';

interface FormProps {
  onNext: () => void;
  onExit: () => void;
}

export const Title = ({ onNext, onExit }: FormProps) => {
  const { setTitle, setDescription, setFile, addDraft } = useCommunityFormActionContext();
  const { title } = useCommunityFormStateContext();
  const [showExitModal, setShowExitModal] = useState(false);

  const handleSave = () => {
    addDraft();
    onExit();
  };

  const handleDelete = () => {
    setTitle('');
    setDescription('');
    setFile([]);
    onExit();
  };

  const handleClickBackButton = () => {
    setShowExitModal(true);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="font-roboto">
      <Topbar
        title="New Post"
        type="back"
        next="Next"
        isNext={title.length > 0}
        onBack={handleClickBackButton}
        onNext={onNext}
      />
      <form className="mt-[72px] px-4" onSubmit={onSubmit}>
        <TextField
          id="title"
          type="text"
          label="Title of a post"
          placeholder="Type here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <button onClick={handleSave} className="mr-2 p-2 bg-bg-brand-default text-text-inverted-default rounded">
              저장
            </button>
            <button onClick={handleDelete} className="mr-2 p-2 bg-text-error text-white rounded">
              삭제
            </button>
            <button onClick={onExit} className="mr-2 p-2 bg-gray-200 rounded">
              돌아가기
            </button>
            <button onClick={() => setShowExitModal(false)} className="p-2 bg-gray-200 rounded">
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
