import { useCommunityFormActionContext } from '@/hooks';
import { PostDraft } from '@/types';
import { formatDate, urlToFile } from '@/utils';
import { Dispatch, SetStateAction } from 'react';
import { Checkbox } from '@/components/shared/checkbox/Checkbox';

interface DraftProps {
  draft: PostDraft;
  isSelected: boolean;
  isEditing: boolean;
  setSelectedDrafts: Dispatch<SetStateAction<number[]>>;
  onNext: () => void;
}

export const Draft = ({ draft, isSelected, isEditing, setSelectedDrafts, onNext }: DraftProps) => {
  const { setType, setCategoryId, setTitle, setDescription, setImages, setDraftId, setIsDraftMode, setOriginalType } =
    useCommunityFormActionContext();

  const selectDraftItem = () => {
    setSelectedDrafts((prev) => [...prev, draft.id]);
  };

  const deleteDraftItem = () => {
    setSelectedDrafts((prev) => prev.filter((id) => id !== draft.id));
  };

  const handleChecked = (e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (isSelected) {
      deleteDraftItem();
    } else {
      selectDraftItem();
    }
  };

  const handleClickDraft = async () => {
    // 원본 타입 저장 (타입 변경 감지용)
    setOriginalType(draft.type);

    // 임시저장 게시글 데이터 설정
    setType(draft.type);
    if (Array.isArray(draft.categoryId)) {
      setCategoryId(draft.categoryId);
    } else {
      setCategoryId([draft.categoryId]);
    }
    setTitle(draft.title);
    setDescription(draft.description);

    try {
      if (draft.images && draft.images.length > 0) {
        const filePromises = draft.images.map((url, index) => urlToFile(url, `draft-image-${index}.jpg`));
        const files = await Promise.all(filePromises);
        setImages(files);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Error converting image URLs to files:', error);
      setImages([]);
    }

    setDraftId(draft.id);
    setIsDraftMode(true);

    onNext();
  };

  return (
    <div
      key={draft.id}
      className="border-t-[1px] border-border-default py-[22px] px-[28px] h-[88px] font-roboto flex items-center justify-between cursor-pointer"
      onClick={isEditing ? undefined : handleClickDraft}
    >
      <div className={`flex-1`}>
        <h2 className="text-text-default font-normal">{draft.title || '제목 없음'}</h2>
        <p className="text-text-weak text-sm font-normal">
          {draft.type} | {formatDate(draft.createdAt)}
        </p>
      </div>
      {isEditing && (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={isSelected} onChange={handleChecked} className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
