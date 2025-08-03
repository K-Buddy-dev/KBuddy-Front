import { Dispatch, SetStateAction } from 'react';
import { FaTimes } from 'react-icons/fa';

interface BlockUserModalProps {
  userId: string;
  blockMutate: (id: string) => void;
  setShowBlockUserModal: Dispatch<SetStateAction<boolean>>;
}

export const BlockUserModal = ({ userId, blockMutate, setShowBlockUserModal }: BlockUserModalProps) => {
  const handleDelete = (userId: string) => {
    setShowBlockUserModal(false);
    blockMutate(userId);
  };
  return (
    <div
      className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={() => {
        setShowBlockUserModal(false);
      }}
    >
      <div className="bg-white rounded-lg" onClick={(e) => e.stopPropagation()}>
        <div className="w-full flex items-center justify-end px-4 py-4 border-b-2">
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => {
              setShowBlockUserModal(false);
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="w-full flex flex-col items-start px-4">
          <button
            className="w-full py-[21px] px-2 text-text-danger-default font-semibold flex items-center"
            onClick={() => handleDelete(userId)}
          >
            Block this user
          </button>
        </div>
      </div>
    </div>
  );
};
