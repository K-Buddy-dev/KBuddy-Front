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
  const [isDraftMode, setIsDraftMode] = useState<boolean>(false);
  const [isEditMode, setisEditMode] = useState<boolean>(false);
  const [detailBackUrl, setDetailBackUrl] = useState<string>('');
  const [originalType, setOriginalType] = useState<PostFormType | null>(null);

  const stateValue = useMemo<CommunityFormStateContextType>(
    () => ({
      categoryId,
      title,
      description,
      images,
      type,
      draftId,
      isDraftMode,
      isEditMode,
      detailBackUrl,
      originalType,
    }),
    [categoryId, title, description, images, type, draftId, isDraftMode, isEditMode, detailBackUrl, originalType]
  );

  const actionValue = useMemo<CommunityFormActionContextType>(
    () => ({
      setCategoryId,
      setTitle,
      setDescription,
      setImages,
      setType,
      setDraftId,
      setIsDraftMode,
      setisEditMode,
      setDetailBackUrl,
      setOriginalType,
      reset: () => {
        setCategoryId([]);
        setTitle('');
        setDescription('');
        setImages([]);
        setType('');
        setDraftId(null);
        setIsDraftMode(false);
        setisEditMode(false);
        setOriginalType(null);
      },
    }),
    [categoryId, title, description, images, type, draftId, isDraftMode, setisEditMode, setDetailBackUrl, originalType]
  );

  return (
    <CommunityFormStateContext.Provider value={stateValue}>
      <CommunityFormActionContext.Provider value={actionValue}>
        <Outlet />
      </CommunityFormActionContext.Provider>
    </CommunityFormStateContext.Provider>
  );
};
