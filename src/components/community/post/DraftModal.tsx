import { useCommunityFormStateContext } from '@/hooks';
import { usePost } from '@/hooks/usePost';

interface DraftModalProps {
  onExit: () => void;
  setShowExitModal: (show: boolean) => void;
}

export const DraftModal = ({ onExit, setShowExitModal }: DraftModalProps) => {
  const { type, categoryId, title, description, images, isEditMode } = useCommunityFormStateContext();

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
        <div className="w-full p-6">
          <h1 className="text-text-default text-[22px] font-medium m-auto mb-4">Save this post as a draft?</h1>
          <p className="text-text-weak text-sm font-normal m-auto">If you discard now, you’ll lose this post.</p>
        </div>
        <div className="w-full flex flex-col px-4">
          <button onClick={handleDelete} className="py-[21px] text-text-danger-default font-semibold border-b-2">
            Discard post
          </button>
          {!isEditMode && (
            <button onClick={handleSave} className="py-[21px] text-text-default font-semibold border-b-2">
              Save draft
            </button>
          )}
          <button onClick={() => setShowExitModal(false)} className="py-[21px] text-text-default font-semibold">
            Keep editing
          </button>
        </div>
      </div>
    </div>
  );
};
