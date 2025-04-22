import { CheckboxIcon, TrashIcon } from '@/components/shared/icon/Icon';
import { PostDraft } from '@/types';
import { cn } from '@/utils/utils';
import { useState } from 'react';
import { blogService } from '@/services/blogService';
import { qnaService } from '@/services/qnaService';

interface DraftsControllerProps {
  isDraftEmpty: boolean;
  isAllSelected: boolean;
  setSelectedDrafts: (drafts: number[]) => void;
  selectedDrafts: number[];
  drafts: PostDraft[];
  refreshDrafts: () => void;
}

export const DraftsController = ({
  isDraftEmpty,
  isAllSelected,
  setSelectedDrafts,
  selectedDrafts,
  drafts,
  refreshDrafts,
}: DraftsControllerProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedDrafts([]);
    } else {
      setSelectedDrafts(drafts.map((draft) => draft.id));
    }
  };

  const handleDeleteDraft = async () => {
    const selectedDraftIds = drafts
      .filter((draft) => {
        return isAllSelected || (draft.id && selectedDrafts.includes(draft.id));
      })
      .map((draft) => ({ id: draft.id, type: draft.type }));

    if (selectedDraftIds.length === 0) return;

    try {
      setIsDeleting(true);

      const deletePromises = selectedDraftIds.map(({ id, type }) => {
        if (type === 'Blog') {
          return blogService.deleteBlog(id);
        } else if (type === 'Q&A') {
          return qnaService.deleteQna(id);
        }
        return Promise.resolve(false);
      });

      await Promise.all(deletePromises);

      setSelectedDrafts([]);
      refreshDrafts();
    } catch (error) {
      console.error('임시저장 글 삭제 실패:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-bg-medium h-12 px-4">
      <button
        className={cn(
          'flex items-center gap-2 text-text-default font-semibold',
          isDraftEmpty || isDeleting || selectedDrafts.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
        )}
        onClick={handleDeleteDraft}
        disabled={isDraftEmpty || isDeleting || selectedDrafts.length === 0}
      >
        <TrashIcon />
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
      <button
        className="flex items-center gap-2 font-semibold"
        onClick={handleSelectAll}
        disabled={isDeleting || isDraftEmpty}
      >
        <CheckboxIcon selected={isAllSelected} allSelected={isAllSelected} />
        <span className={isAllSelected ? 'text-text-default' : 'text-text-weak'}>Select all</span>
      </button>
    </div>
  );
};
