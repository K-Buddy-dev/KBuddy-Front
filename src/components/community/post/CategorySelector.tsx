import { Button, CheckedIcon, UnCheckedIcon } from '@/components/shared';
import { POST_CATEGORIES } from '@/constants';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { SectionInfo } from './SectionInfo';

interface CategorySelectorProps {
  onNext: () => void;
}

export const CategorySelector = ({ onNext }: CategorySelectorProps) => {
  const { type, categoryId } = useCommunityFormStateContext();
  const { setCategoryId } = useCommunityFormActionContext();

  const isValid = type && categoryId.length > 0;

  const handleCategorySelect = (id: number) => {
    if (type === 'Q&A') {
      if (!categoryId.includes(id)) {
        setCategoryId([id]);
      }
    } else {
      setCategoryId((prev) => {
        if (prev.includes(id)) {
          return prev.filter((_id) => _id !== id);
        }
        return [...prev, id];
      });
    }
  };

  return (
    <div
      className={`w-full mt-14 px-4 border-t border-border-default transition-all duration-500 ease-in-out ${
        type ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="mt-3 mb-[18px]">
        <Button
          type="submit"
          variant="solid"
          color="primary"
          size="large"
          className="w-full"
          disabled={!isValid}
          onClick={() => {
            onNext();
          }}
        >
          Next
        </Button>
      </div>
      <SectionInfo
        title="Select categories"
        description={
          type === 'Q&A'
            ? 'Choose one category that fits your question.'
            : 'Choose at least one category that fits your blog. Feel free to select multiple categories.'
        }
      />
      <div className="grid grid-cols-2 gap-4">
        {POST_CATEGORIES.map((category) => (
          <div
            key={category.name}
            className="flex items-center justify-start cursor-pointer gap-1 py-2 px-3 rounded-lg border-2 border-border-default"
            onClick={() => handleCategorySelect(category.id)}
          >
            <div className="h-6 w-6 flex items-center justify-center">
              {categoryId.includes(category.id) ? <CheckedIcon /> : <UnCheckedIcon />}
            </div>
            <span className="text-sm font-normal">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
