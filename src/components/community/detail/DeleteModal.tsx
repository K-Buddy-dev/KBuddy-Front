import { Dispatch, SetStateAction } from 'react';
import { FaTrash, FaTimes } from 'react-icons/fa';

interface DeleteModalProps {
  commentId: number;
  deleteMutate: (id: number) => void;
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
}

export const DeletelModal = ({ commentId, deleteMutate, setShowDeleteModal }: DeleteModalProps) => {
  const handleDelete = (commentId: number) => {
    setShowDeleteModal(false);
    deleteMutate(commentId);
  };
  return (
    <div
      className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={() => {
        setShowDeleteModal(false);
      }}
    >
      <div className="bg-white rounded-lg" onClick={(e) => e.stopPropagation()}>
        <div className="w-full flex items-center justify-end px-4 py-4 border-b-2">
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="w-full flex flex-col items-start px-4">
          <button
            className="w-full py-[21px] px-2 text-text-danger-default font-semibold flex items-center"
            onClick={() => handleDelete(commentId)}
          >
            <FaTrash className="mr-2" /> Delete this comment
          </button>
        </div>
      </div>
    </div>
  );
};
