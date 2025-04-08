import { useCommunityFormStateContext, useCommunityFormActionContext } from '@/hooks/useCommunityFormContext';
import { TextField, Topbar } from '@/components/shared';
import { useState } from 'react';

interface PreviewProps {
  onNext: () => void;
  onExit: () => void;
}

export const Description = ({ onNext, onExit }: PreviewProps) => {
  const { title, description, file } = useCommunityFormStateContext();
  const { setDescription, addDraft, setTitle, setFile } = useCommunityFormActionContext();
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
        isNext={description.length > 0}
        onBack={handleClickBackButton}
        onNext={onNext}
      />
      <form className="mt-[72px]" onSubmit={onSubmit}>
        <div>
          <div className="flex justify-center items-center mx-4 mt-6">
            <TextField label="Title of a post" id="title" value={title} disabled />
          </div>
          <div className="bg-bg-medium">
            <div className="w-full h-[272px] overflow-x-hidden flex items-center gap-6 p-4">
              {file.map((f, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(f)}
                  alt={`Preview ${index + 1}`}
                  className="w-40 h-[200px] object-cover rounded"
                />
              ))}
            </div>
          </div>
          <textarea
            id="description"
            className="w-full resize-none focus:outline-none py-4 px-4"
            placeholder="Start writing a blog or question"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
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
