import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export interface PostDraft {
  categoryIds: number[];
  title: string;
  description: string;
  file?: File[];
}

export interface CommunityFormStateContextType {
  categoryIds: number[];
  title: string;
  description: string;
  file: File[];
  type: 'blog' | 'qna' | '';
  drafts: { id: string; createdAt: string; data: PostDraft }[];
}

export interface CommunityFormActionContextType {
  setCategoryIds: Dispatch<SetStateAction<number[]>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setFile: Dispatch<SetStateAction<File[]>>;
  setType: Dispatch<SetStateAction<'blog' | 'qna' | ''>>;
  addDraft: () => void;
  deleteDraft: (id: string) => void;
  loadDraft: (draft: PostDraft) => void;
}

export const CommunityFormStateContext = createContext<CommunityFormStateContextType | undefined>(undefined);
export const CommunityFormActionContext = createContext<CommunityFormActionContextType | undefined>(undefined);

export const useCommunityFormStateContext = () => {
  const state = useContext(CommunityFormStateContext);
  if (state === undefined) {
    throw new Error('useCommunityFormStateContext must be used within an CommunityFormStateContextProvider');
  }
  return state;
};
export const useCommunityFormActionContext = () => {
  const actions = useContext(CommunityFormActionContext);
  if (actions === undefined) {
    throw new Error('useCommunityFormActionContext must be used within an CommunityFormActionContextProvider');
  }
  return actions;
};
