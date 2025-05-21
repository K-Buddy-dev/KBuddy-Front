import { useCommunityFormStateContext } from '@/hooks';
import { usePost } from '@/hooks/usePost';

interface DraftModalProps {
  onExit: () => void;
  setShowExitModal: (show: boolean) => void;
}

export const DraftModal = ({ onExit, setShowExitModal }: DraftModalProps) => {
  const { type, categoryId, title, description, images } = useCommunityFormStateContext();
  const { createPost } = usePost();
  const handleDelete = () => onExit();

  const handleSave = async () => {
    const data = {
      type,
      categoryId,
      title,
      description,
      images,
    };
    await createPost(data, 'DRAFT');
    onExit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg pb-2">
        <div className="w-full flex flex-col px-4">
          <button onClick={handleDelete} className="py-[21px] text-text-danger-default font-semibold border-b-2">
            Discard post
          </button>
          <button onClick={handleSave} className="py-[21px] text-text-default font-semibold border-b-2">
            Save draft
          </button>
          <button onClick={() => setShowExitModal(false)} className="py-[21px] text-text-default font-semibold">
            Keep editing
          </button>
        </div>
      </div>
    </div>
  );
};
