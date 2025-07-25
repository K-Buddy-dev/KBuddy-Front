import { PostFormType } from '@/types';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export interface CommunityFormStateContextType {
  categoryId: number[];
  title: string;
  description: string;
  images: File[];
  type: PostFormType;
  draftId: number | null;
  isDraftMode: boolean;
  isEditMode: boolean;
  detailBackUrl: string;
  originalType: PostFormType | null;
}

export interface CommunityFormActionContextType {
  setCategoryId: Dispatch<SetStateAction<number[]>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setImages: Dispatch<SetStateAction<File[]>>;
  setType: Dispatch<SetStateAction<PostFormType>>;
  setDraftId: Dispatch<SetStateAction<number | null>>;
  setIsDraftMode: Dispatch<SetStateAction<boolean>>;
  setisEditMode: Dispatch<SetStateAction<boolean>>;
  setDetailBackUrl: Dispatch<SetStateAction<string>>;
  setOriginalType: Dispatch<SetStateAction<PostFormType | null>>;
  reset: () => void;
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
