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

  return (
    <div className="w-full px-4">
      <SectionInfo title="Type of a post" description="Please select the correct type of post." />
      <div className="w-full flex flex-col items-start mb-4">
        <div className="w-full grid grid-cols-2 gap-4">
          {POST_TYPES.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 py-2 px-3 rounded-lg border-2 border-border-default"
            >
              <input
                type="radio"
                name="post-type"
                value={option.value}
                checked={type === option.value}
                onChange={handleTypeChange}
                className="hidden"
              />
              {type === option.value ? <SelectedRadioIcon /> : <UnSelectedRadioIcon />}
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
