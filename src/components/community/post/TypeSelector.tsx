import { POST_TYPES } from '@/constants';
import { SectionInfo } from './SectionInfo';
import { SelectedRadioIcon, UnSelectedRadioIcon } from '@/components/shared';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';

export const TypeSelector = () => {
  const { type } = useCommunityFormStateContext();
  const { setType, setCategoryId } = useCommunityFormActionContext();

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value as 'Blog' | 'Q&A');
    setCategoryId([]);
  };

  const getTypeDescription = (value: string) => {
    if (value === 'Q&A') {
      return 'Ask a specific question and get help from the community.';
    }
    return 'Share experiences, tips, and guides for life in Korea.';
  };

  return (
    <div className="w-full px-4">
      <SectionInfo title="Post type" description="Pick the format that best matches your post." />
      <div className="w-full flex flex-col items-start mb-4">
        <div className="w-full grid grid-cols-2 gap-4">
          {POST_TYPES.map((option) => (
            <label
              key={option.value}
              className={`flex min-h-[132px] flex-col gap-3 rounded-lg border-2 p-4 transition-colors ${
                type === option.value
                  ? 'border-border-brand-default bg-bg-brand-weak'
                  : 'border-border-default bg-white'
              }`}
            >
              <input
                type="radio"
                name="post-type"
                value={option.value}
                checked={type === option.value}
                onChange={handleTypeChange}
                className="hidden"
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-semibold text-text-default">{option.label}</span>
                {type === option.value ? <SelectedRadioIcon /> : <UnSelectedRadioIcon />}
              </div>
              <span className="text-sm leading-5 text-text-weak">{getTypeDescription(option.value)}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
