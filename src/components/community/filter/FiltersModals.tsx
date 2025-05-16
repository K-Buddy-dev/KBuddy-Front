import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '@/types/community';
import { Topbar } from '@/components/shared';

interface FiltersModalProps {
  onApply: (filters: { sort: string; categoryCode: number | undefined }) => void;
  onClose: () => void;
}

export const FiltersModal: React.FC<FiltersModalProps> = ({ onApply, onClose }) => {
  const [searchParams] = useSearchParams();

  const initialSort = searchParams.get('sort') || 'latest';
  const initialCategoryCode = searchParams.get('categoryCode') ? Number(searchParams.get('categoryCode')) : undefined;

  const [sort, setSort] = useState<string>(initialSort);
  const [categoryCode, setCategoryCode] = useState<number | undefined>(initialCategoryCode);

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  const handleCategorySelect = (id: number) => {
    setCategoryCode(categoryCode === id ? undefined : id);
  };

  const handleClearAll = () => {
    setSort('latest');
    setCategoryCode(undefined);
  };

  const handleApply = () => {
    onApply({ sort, categoryCode });
    onClose();
  };

  return (
    <div className="relative flex flex-col h-full min-w-[280px] w-full sm:w-[600px] bg-white p-4 font-roboto mx-auto">
      <Topbar title="Filters" type="cancel" onCancle={onClose} />

      <div className="flex-1 overflow-y-auto">
        <div className="mt-16 mb-2 border-b-[1px] border-border-weak1">
          <h3 className="font-medium text-text-default">Sort by</h3>
          <div className="space-y-2 mt-2">
            {['Latest', 'Popular', 'Oldest'].map((option) => (
              <label key={option} className="flex items-center justify-between w-full h-12 cursor-pointer">
                <div>{option}</div>
                <input
                  type="radio"
                  name="sort"
                  value={option.toLowerCase()}
                  checked={sort === option.toLowerCase()}
                  onChange={() => handleSortChange(option.toLowerCase())}
                  className="w-5 h-5 accent-bg-brand-default"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="py-[14px] font-medium text-text-default">
          <h3 className="mb-[10px]">Category selection</h3>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((category) => (
              <label
                key={category.id}
                className="flex items-center p-3 border border-border-default h-12 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={categoryCode === category.id}
                  onChange={() => handleCategorySelect(category.id)}
                  className="mr-2"
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute m-auto bottom-0 left-0 min-w-[280px] w-full sm:w-[600px] h-[80px] border-t border-border-weak1">
        <div className="h-10 mt-3 px-4 flex items-center justify-between">
          <button onClick={handleClearAll} className="font-semibold underline text-text-default">
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="bg-bg-brand-default text-text-inverted-default font-semibold px-8 py-[13px] rounded-lg"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
