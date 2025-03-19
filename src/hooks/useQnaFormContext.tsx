import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export interface QnaFormStateContextType {
  categoryId: number;
  title: string;
  description: string;
  file: File[];
  hashtags: string[];
}

export interface QnaFormActionContextType {
  setCategoryId: Dispatch<SetStateAction<number>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setFile: Dispatch<SetStateAction<File[]>>;
  setHashtags: Dispatch<SetStateAction<string[]>>;
}

export const QnaFormStateContext = createContext<QnaFormStateContextType | undefined>(undefined);
export const QnaFormActionContext = createContext<QnaFormActionContextType | undefined>(undefined);

export const useQnaFormStateContext = () => {
  const state = useContext(QnaFormStateContext);
  if (state === undefined) {
    throw new Error('useQnaFormStateContext must be used within an QnaFormStateContextProvider');
  }
  return state;
};
export const useQnaFormActionContext = () => {
  const actions = useContext(QnaFormActionContext);
  if (actions === undefined) {
    throw new Error('useQnaFormActionContext must be used within an QnaFormActionContextProvider');
  }
  return actions;
};
