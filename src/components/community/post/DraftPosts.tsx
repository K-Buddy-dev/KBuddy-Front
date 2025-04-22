import { authService } from '@/services';
import { useEffect, useState } from 'react';
import { Draft } from './Draft';
import { PostDraft } from '@/types';
import { DraftsController } from './DraftsController';

interface DraftPostsProps {
  onNext: () => void;
}

export const DraftPosts = ({ onNext }: DraftPostsProps) => {
  const [drafts, setDrafts] = useState<PostDraft[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedDrafts, setSelectedDrafts] = useState<number[]>([]);

  const isAllSelected = selectedDrafts.length === drafts.length && drafts.length > 0;

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
    setSelectedDrafts([]);
  };

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await authService.getUserDrafts();
        const saved = response.data;
        if (saved) {
          setDrafts(saved);
        }
      } catch (error) {
        console.error('Error fetching drafts:', error);
      }
    };
    fetchDrafts();
  }, []);

  return (
    <>
      <div className="text-text-default flex items-center justify-between mb-4 mt-6 px-4">
        <h2 className="font-medium text-lg">Finish your draft</h2>
        {drafts.length > 0 && (
          <button className="font-semibold text-sm text-text-default underline" onClick={handleToggleEdit}>
            {isEditing ? 'Done' : 'Edit drafts'}
          </button>
        )}
      </div>
      {drafts.length > 0 && isEditing && (
        <DraftsController
          isDraftEmpty={drafts.length === 0}
          isAllSelected={isAllSelected}
          setSelectedDrafts={setSelectedDrafts}
          drafts={drafts}
        />
      )}
      {drafts?.map((draft) => (
        <Draft
          key={draft.id}
          draft={draft}
          isSelected={selectedDrafts.includes(draft.id)}
          isEditing={isEditing}
          setSelectedDrafts={setSelectedDrafts}
          onNext={onNext}
        />
      ))}
    </>
  );
};
