import { CancelIcon, PreviewBackIcon, ShareIcon } from '@/components/shared/icon';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

interface DetailTopbarProps {
  title: string;
  type: 'cancel' | 'back';
  isBookmarked?: boolean;
  onBack?: () => void;
  onCancle?: () => void;
  onBookmark?: () => void;
}

function DetailTopbarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-0 left-0 flex items-center justify-between min-w-[280px] w-full sm:w-[600px] h-14 bg-white py-4 pr-4 border-b border-solid border-custom-gray">
      {children}
    </div>
  );
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="flex-1 font-roboto font-normal text-text-default text-[22px] leading-7">{children}</h1>;
}

export function DetailTopbar({ title, type, isBookmarked, onBack, onCancle, onBookmark }: DetailTopbarProps) {
  return (
    <DetailTopbarWrapper>
      <div className="flex items-center justify-start gap-2">
        {type === 'cancel' && (
          <button type="button" onClick={onCancle}>
            <div className="w-12 flex items-center gap-2 p-2 h-[30px] justify-center relative">
              <CancelIcon />
            </div>
          </button>
        )}
        {type === 'back' && (
          <button type="button" onClick={onBack}>
            <PreviewBackIcon />
          </button>
        )}
        <PageTitle>{title}</PageTitle>
      </div>
      <div className="flex items-center justify-center">
        {/* 북마크 */}
        <button onClick={onBookmark} className="flex items-center transition-colors hover:[&>svg]:text-[#6952F9]">
          <span className="sr-only">bookmark</span>
          {isBookmarked ? (
            <FaBookmark className="w-6 h-6 text-[#6952F9] fill-current" />
          ) : (
            <FaRegBookmark className="w-6 h-6 text-text-default stroke-current" />
          )}
        </button>
        {/* 공유하기 */}
        <button className="w-12 h-12">
          <span className="sr-only">share icon</span>
          <ShareIcon />
        </button>
        {/* 메뉴 */}
      </div>
    </DetailTopbarWrapper>
  );
}
