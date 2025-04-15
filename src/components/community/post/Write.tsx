import { Topbar } from '@/components/shared';
import { CheckboxIcon, TrashIcon } from '@/components/shared/icon/Icon';
import { PostDraft, useCommunityFormActionContext } from '@/hooks/useCommunityFormContext';
import { authService } from '@/services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WriteProps {
  onNext: () => void;
}

export const Write = ({ onNext }: WriteProps) => {
  const [drafts, setDrafts] = useState<PostDraft[]>([]);
  const { setTitle, setDescription } = useCommunityFormActionContext();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedDrafts, setSelectedDrafts] = useState<number[]>([]);

  const handleNewPost = () => {
    setTitle('');
    setDescription('');
    onNext();
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSelectDraft = () => {
    onNext();
  };

  const handleClickCancleButton = () => {
    navigate('/community');
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
    setSelectedDrafts([]);
  };

  const handleSelectDraftItem = (id: number) => {
    setSelectedDrafts((prev) => [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedDrafts.length === drafts.length) {
      setSelectedDrafts([]);
    } else {
      setSelectedDrafts(drafts.map((draft) => draft.id));
    }
  };

  const handleDeleteSelected = () => {
    setSelectedDrafts([]);
  };

  const isAllSelected = selectedDrafts.length === drafts.length && drafts.length > 0;

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
    <div className="font-roboto">
      <Topbar title="Write a Post" type="cancel" onCancle={handleClickCancleButton} />
      <div className="mt-[72px] px-4">
        <button
          className="mt-6 w-full h-12 bg-bg-brand-default rounded-lg font-semibold text-text-inverted-default"
          onClick={handleNewPost}
        >
          Create a new post
        </button>
        <div className="text-text-default flex items-center justify-between mb-4 mt-6">
          <h2 className="font-medium text-lg">Finish your draft</h2>
          {drafts.length > 0 && (
            <button className="font-semibold text-sm text-text-default underline" onClick={handleToggleEdit}>
              {isEditing ? 'Done' : 'Edit drafts'}
            </button>
          )}
        </div>
      </div>
      {drafts.length > 0 && isEditing && (
        <div className="flex items-center justify-between bg-bg-medium h-12 px-4">
          <button
            className={`flex items-center gap-2 text-text-default font-semibold ${
              selectedDrafts.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleDeleteSelected}
            disabled={selectedDrafts.length === 0}
          >
            <TrashIcon />
            Delete
          </button>
          <button className="flex items-center gap-2 font-semibold" onClick={handleSelectAll}>
            <CheckboxIcon selected={isAllSelected} allSelected={isAllSelected} />
            <span className={isAllSelected ? 'text-text-default' : 'text-text-weak'}>Select all</span>
          </button>
        </div>
      )}
      {drafts.length > 0 && (
        <div>
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="border-t-[1px] border-border-default py-[22px] px-[28px] h-[88px] font-roboto flex items-center justify-between cursor-pointer"
              onClick={isEditing ? () => handleSelectDraftItem(draft.id) : () => handleSelectDraft()}
            >
              <div className={`flex-1`}>
                <h2 className="text-text-default font-normal">{draft.title || '제목 없음'}</h2>
                <p className="text-text-weak text-sm font-normal">{formatDate(draft.createdAt)}</p>
              </div>
              {isEditing && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedDrafts.includes(draft.id)}
                    onChange={() => {
                      handleSelectDraftItem(draft.id);
                    }}
                    className="w-5 h-5"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
