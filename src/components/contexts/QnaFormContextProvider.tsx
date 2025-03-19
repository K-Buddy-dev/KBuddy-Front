import { QnaFormActionContext, QnaFormActionContextType, QnaFormStateContext, QnaFormStateContextType } from '@/hooks';
import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

export function QnaFormContextProvider() {
  const [categoryId, setCategoryId] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [file, setFile] = useState<File[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);

  const qnaFormStateContextValue = useMemo<QnaFormStateContextType>(
    () => ({
      categoryId,
      title,
      file,
      hashtags,
    }),
    [categoryId, title, file, hashtags]
  );

  const qnaFormActionContextValue = useMemo<QnaFormActionContextType>(
    () => ({
      setCategoryId,
      setTitle,
      setFile,
      setHashtags,
    }),
    [setCategoryId, setTitle, setFile, setHashtags]
  );

  return (
    <QnaFormStateContext.Provider value={qnaFormStateContextValue}>
      <QnaFormActionContext.Provider value={qnaFormActionContextValue}>
        <Outlet />
      </QnaFormActionContext.Provider>
    </QnaFormStateContext.Provider>
  );
}
