import { CheckboxIcon, TrashIcon } from '@/components/shared/icon/Icon';
import { PostDraft } from '@/types';
import { cn } from '@/utils/utils';

interface DraftsControllerProps {
  isDraftEmpty: boolean;
  isAllSelected: boolean;
  setSelectedDrafts: (drafts: number[]) => void;
  drafts: PostDraft[];
}

export const DraftsController = ({ isDraftEmpty, isAllSelected, setSelectedDrafts, drafts }: DraftsControllerProps) => {
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedDrafts([]);
    } else {
      setSelectedDrafts(drafts.map((draft) => draft.id));
    }
  };

  const handleDeleteDraft = () => {
    console.log('삭제');
  };

  return (
    <div className="flex items-center justify-between bg-bg-medium h-12 px-4">
      <button
        className={cn(
          'flex items-center gap-2 text-text-default font-semibold',
          isDraftEmpty ? 'opacity-50 cursor-not-allowed' : ''
        )}
        onClick={handleDeleteDraft}
        disabled={isDraftEmpty}
      >
        <TrashIcon />
        Delete
      </button>
      <button className="flex items-center gap-2 font-semibold" onClick={handleSelectAll}>
        <CheckboxIcon selected={isAllSelected} allSelected={isAllSelected} />
        <span className={isAllSelected ? 'text-text-default' : 'text-text-weak'}>Select all</span>
      </button>
    </div>
  );
};
