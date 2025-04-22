import { useState, useMemo } from 'react';
import {
  CommunityFormStateContext,
  CommunityFormActionContext,
  CommunityFormStateContextType,
  CommunityFormActionContextType,
} from '@/hooks/useCommunityFormContext';
import { Outlet } from 'react-router-dom';
import { PostFormType } from '@/types';

export const CommunityFormContextProvider = () => {
  const [categoryId, setCategoryId] = useState<number[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [type, setType] = useState<PostFormType>('');
  const [draftId, setDraftId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [originalType, setOriginalType] = useState<PostFormType | null>(null);

  const stateValue = useMemo<CommunityFormStateContextType>(
    () => ({
      categoryId,
      title,
      description,
      images,
      type,
      draftId,
      isEditMode,
      originalType,
    }),
    [categoryId, title, description, images, type, draftId, isEditMode, originalType]
  );

  const actionValue = useMemo<CommunityFormActionContextType>(
    () => ({
      setCategoryId,
      setTitle,
      setDescription,
      setImages,
      setType,
      setDraftId,
      setIsEditMode,
      setOriginalType,
      reset: () => {
        setCategoryId([]);
        setTitle('');
        setDescription('');
        setImages([]);
        setType('');
        setDraftId(null);
        setIsEditMode(false);
        setOriginalType(null);
      },
    }),
    [categoryId, title, description, images, type, draftId, isEditMode, originalType]
  );

  return (
    <CommunityFormStateContext.Provider value={stateValue}>
      <CommunityFormActionContext.Provider value={actionValue}>
        <Outlet />
      </CommunityFormActionContext.Provider>
    </CommunityFormStateContext.Provider>
  );
};
