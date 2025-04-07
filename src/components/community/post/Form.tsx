import { useState } from 'react';
import { useCommunityFormActionContext } from '@/hooks/useCommunityFormContext';
import { TextField, Topbar } from '@/components/shared';
import { usePostForm } from '@/hooks/usePostForm';
import { Controller } from 'react-hook-form';

interface FormProps {
  onNext: () => void;
  onExit: () => void;
}

export const Form = ({ onNext, onExit }: FormProps) => {
  const { setTitle, setDescription, setFile, addDraft } = useCommunityFormActionContext();
  const [showExitModal, setShowExitModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = usePostForm();

  const handleSave = () => {
    addDraft();
    onExit();
  };

  const handleDelete = () => {
    setTitle('');
    setDescription('');
    setFile([]);
    onExit();
  };

  const handleClickBackButton = () => {
    setShowExitModal(true);
  };

  const onSubmit = (data: { title: string; description: string }) => {
    setTitle(data.title);
    setDescription(data.description);
    onNext();
  };

  return (
    <div className="font-roboto">
      <Topbar
        title="New Post"
        type="back"
        next="Next"
        isNext={isValid}
        onBack={handleClickBackButton}
        onNext={onNext}
      />
      <form className="mt-[72px] px-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState: { error } }) => (
            <TextField
              id="title"
              type="text"
              label="Title of a post"
              placeholder="Type here"
              error={error?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState: { error } }) => (
            <div className="mt-4">
              <textarea
                id="description"
                placeholder="Start writing a blog or question"
                {...field}
                className="w-full h-40 p-3 border border-border-default rounded-lg text-text-default placeholder-text-weak focus:outline-none focus:ring-2 focus:ring-bg-brand-default resize-none"
              />
              {error && <p className="text-text-error text-sm mt-1">{error.message}</p>}
            </div>
          )}
        />
      </form>
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <button onClick={handleSave} className="mr-2 p-2 bg-bg-brand-default text-text-inverted-default rounded">
              저장
            </button>
            <button onClick={handleDelete} className="mr-2 p-2 bg-text-error text-white rounded">
              삭제
            </button>
            <button onClick={onExit} className="mr-2 p-2 bg-gray-200 rounded">
              돌아가기
            </button>
            <button onClick={() => setShowExitModal(false)} className="p-2 bg-gray-200 rounded">
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
