import { useState, useMemo } from 'react';
import {
  CommunityFormStateContext,
  CommunityFormActionContext,
  CommunityFormStateContextType,
  CommunityFormActionContextType,
} from '@/hooks/useCommunityFormContext';
import { Outlet } from 'react-router-dom';

export const CommunityFormContextProvider = () => {
  const [categoryId, setCategoryId] = useState<number[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File[]>([]);
  const [type, setType] = useState<'blog' | 'qna' | ''>('');

  const stateValue = useMemo<CommunityFormStateContextType>(
    () => ({
      categoryId,
      title,
      description,
      file,
      type,
    }),
    [categoryId, title, description, file, type]
  );

  const actionValue = useMemo<CommunityFormActionContextType>(
    () => ({
      setCategoryId,
      setTitle,
      setDescription,
      setFile,
      setType,
      reset: () => {
        setCategoryId([]);
        setTitle('');
        setDescription('');
        setFile([]);
        setType('');
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
