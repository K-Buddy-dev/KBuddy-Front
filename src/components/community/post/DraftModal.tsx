import { useCommunityFormStateContext } from '@/hooks';
import { usePost } from '@/hooks/usePost';

interface DraftModalProps {
  onExit: () => void;
  setShowExitModal: (show: boolean) => void;
}

export const DraftModal = ({ onExit, setShowExitModal }: DraftModalProps) => {
  const { type, categoryId, title, description, file } = useCommunityFormStateContext();
  const { createPost } = usePost();
  const handleDelete = () => onExit;

  const handleSave = async () => {
    const data = {
      type,
      categoryId,
      title,
      description,
      file,
    };
    await createPost(data, 'DRAFT');
    onExit();
  };

  return (
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
  );
};
