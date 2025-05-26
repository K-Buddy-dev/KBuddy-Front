import { useCommunityFormActionContext } from '@/hooks';
import { CommunityDetail, PostFormType } from '@/types';
import { urlToFile } from '@/utils/utils';

import { Dispatch, SetStateAction } from 'react';
import { FaExclamationTriangle, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface DetailModalProps {
  content: CommunityDetail;
  contentId: number;
  writerUuid: number;
  targetTab: PostFormType;
  deleteMutate: (id: number) => void;
  setShowDetailModal: Dispatch<SetStateAction<boolean>>;
}

export const DetailModal = ({
  content,
  contentId,
  writerUuid,
  targetTab,
  deleteMutate,
  setShowDetailModal,
}: DetailModalProps) => {
  const navigate = useNavigate();
  const { setType, setCategoryId, setTitle, setDescription, setImages, setDraftId, setIsEditMode, setOriginalType } =
    useCommunityFormActionContext();

  const localUserData = localStorage.getItem('basicUserData');
  if (!localUserData) {
    navigate('/');
    return;
  }
  const userInfo = JSON.parse(localUserData);

  const isMyPost = userInfo.uuid === writerUuid;

  const handleReport = () => {
    alert('신고가 접수되었습니다.(임시)');
    setShowDetailModal(false);
  };

  const handleEdit = async (content: CommunityDetail) => {
    setOriginalType(targetTab);

    setType(targetTab);
    if (Array.isArray(content.categoryId)) {
      setCategoryId(content.categoryId);
    } else {
      setCategoryId([content.categoryId]);
    }
    setTitle(content.title);
    setDescription(content.description);

    try {
      if (content.images && content.images.length > 0) {
        const filePromises = content.images.map((image, index) => urlToFile(image.url, `content-image-${index}.jpg`));
        const files = await Promise.all(filePromises);
        setImages(files);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Error converting image URLs to files:', error);
      setImages([]);
    }

    setDraftId(content.id);
    setIsEditMode(true);
    navigate('/community/edit');
  };

  const handleDelete = (contentId: number) => {
    navigate(`/community?tab=${targetTab === 'Q&A' ? 'Q&A' : 'User+blog'}`, { replace: true });
    deleteMutate(contentId);
  };
  return (
    <div
      className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={() => {
        setShowDetailModal(false);
      }}
    >
      <div className="bg-white rounded-lg" onClick={(e) => e.stopPropagation()}>
        <div className="w-full flex items-center justify-end px-4 py-4 border-b-2">
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => {
              setShowDetailModal(false);
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="w-full flex flex-col items-start px-4">
          <button
            className={`w-full py-[21px] px-2 text-text-danger-default font-semibold flex items-center ${isMyPost && ' border-b-2'}`}
            onClick={handleReport}
          >
            <FaExclamationTriangle className="mr-2" /> Report this content
          </button>
          {isMyPost && (
            <>
              <button
                className="w-full py-[21px] px-2 text-text-default font-semibold border-b-2 flex items-center"
                onClick={() => handleEdit(content)}
              >
                <FaEdit className="mr-2" /> Edit this content
              </button>
              <button
                className="w-full py-[21px] px-2 text-text-default font-semibold flex items-center"
                onClick={() => handleDelete(contentId)}
              >
                <FaTrash className="mr-2" /> Delete this content
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
