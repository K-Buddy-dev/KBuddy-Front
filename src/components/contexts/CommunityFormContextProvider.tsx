import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CommunityFormStateContext,
  CommunityFormActionContext,
  CommunityFormStateContextType,
  CommunityFormActionContextType,
  PostDraft,
} from '@/hooks/useCommunityFormContext';
import { Outlet } from 'react-router-dom';

export const CommunityFormContextProvider = () => {
  const [categoryId, setCategoryId] = useState<number[] | number>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File[]>([]);
  const [drafts, setDrafts] = useState<{ id: string; createdAt: string; data: PostDraft }[]>(() => {
    const saved = localStorage.getItem('community-form-drafts');
    return saved ? JSON.parse(saved) : [];
  });
  const [type, setType] = useState<'blog' | 'qna'>('blog');
  // localStorage에 drafts 저장하기 위해 제작
  useEffect(() => {
    localStorage.setItem('community-form-drafts', JSON.stringify(drafts));
  }, [drafts]);

  const stateValue = useMemo<CommunityFormStateContextType>(
    () => ({
      categoryId,
      title,
      description,
      file,
      type,
      drafts,
    }),
    [categoryId, title, description, file, type, drafts]
  );

  const actionValue = useMemo<CommunityFormActionContextType>(
    () => ({
      setCategoryId,
      setTitle,
      setDescription,
      setFile,
      setType,
      addDraft: () => {
        const draftData: PostDraft = {
          categoryId,
          title,
          description,
        };
        const newDraft = {
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          data: draftData,
        };
        setDrafts((prev) => [
          ...prev.filter((d) => d.data.title !== draftData.title || d.data.description !== draftData.description),
          newDraft,
        ]);
      },
      deleteDraft: (id: string) => {
        setDrafts((prev) => prev.filter((d) => d.id !== id));
      },
      loadDraft: (draft: PostDraft) => {
        setCategoryId(draft.categoryId);
        setTitle(draft.title);
        setDescription(draft.description);
      },
    }),
    [categoryId, title, description, file]
  );

  return (
    <CommunityFormStateContext.Provider value={stateValue}>
      <CommunityFormActionContext.Provider value={actionValue}>
        <Outlet />
      </CommunityFormActionContext.Provider>
    </CommunityFormStateContext.Provider>
  );
};
