import { useState, useEffect, useMemo, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CommunityFormStateContext,
  CommunityFormActionContext,
  CommunityFormStateContextType,
  CommunityFormActionContextType,
  PostDraft,
} from '@/hooks/useCommunityFormContext';

interface CommunityFormContextProviderProps {
  children: ReactNode;
}

export const CommunityFormContextProvider = ({ children }: CommunityFormContextProviderProps) => {
  const [categoryId, setCategoryId] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<{ id: string; createdAt: string; data: PostDraft }[]>(() => {
    const saved = localStorage.getItem('community-form-drafts');
    return saved ? JSON.parse(saved) : [];
  });

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
      hashtags,
      drafts,
    }),
    [categoryId, title, description, file, hashtags, drafts]
  );

  const actionValue = useMemo<CommunityFormActionContextType>(
    () => ({
      setCategoryId,
      setTitle,
      setDescription,
      setFile,
      setHashtags,
      addDraft: () => {
        const draftData: PostDraft = {
          categoryId,
          title,
          description,
          hashtags,
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
        setHashtags(draft.hashtags);
      },
    }),
    [categoryId, title, description, file, hashtags]
  );

  return (
    <CommunityFormStateContext.Provider value={stateValue}>
      <CommunityFormActionContext.Provider value={actionValue}>{children}</CommunityFormActionContext.Provider>
    </CommunityFormStateContext.Provider>
  );
};
