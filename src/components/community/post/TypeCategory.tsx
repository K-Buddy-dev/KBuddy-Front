import { Topbar } from '@/components/shared';
import { DraftModal } from './DraftModal';
import { useState } from 'react';
import { CategorySelector } from './CategorySelector';
import { TypeSelector } from './TypeSelector';
import { useCommunityFormStateContext } from '@/hooks';

interface PreviewProps {
  onNext: () => void;
  onExit: () => void;
}

export const TypeCategory = ({ onNext, onExit }: PreviewProps) => {
  const { type, categoryId } = useCommunityFormStateContext();
  const [showExitModal, setShowExitModal] = useState(false);

  const handleClickBackButton = () => {
    if (type && categoryId.length > 0) {
      setShowExitModal(true);
    } else {
      onExit();
    }
  };

  return (
    <div className="font-roboto">
      <Topbar title="Post Preview" type="back" isNext={true} onBack={handleClickBackButton} />
      {/* <div className="bg-bg-medium w-full h-[326px] mt-14 px-4">
        <SectionInfo
          title="Post Preview"
          description="Here's a sneak peek of how your blog preview will look once it's published in the community space."
        />
      </div> */}
      <TypeSelector />
      <CategorySelector onNext={onNext} />
      {showExitModal && <DraftModal onExit={onExit} setShowExitModal={setShowExitModal} />}
    </div>
  );
};
