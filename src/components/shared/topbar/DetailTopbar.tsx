import { CancelIcon, HanburgerMenu, PreviewBackIcon, ShareIcon } from '@/components/shared/icon';
import { useToast } from '@/hooks';
import { getBaseUrl } from '@/utils';
import { Dispatch, SetStateAction } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Toast } from '../toast';

interface DetailTopbarProps {
  title: string;
  description: string;
  type: 'cancel' | 'back';
  isBookmarked?: boolean;
  showDetailModal: boolean;
  onBack?: () => void;
  onCancle?: () => void;
  onBookmark?: (event: React.MouseEvent) => void;
  setShowDetailModal: Dispatch<SetStateAction<boolean>>;
}

function DetailTopbarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-0 left-0 flex items-center justify-between min-w-[280px] w-full sm:w-[600px] h-14 bg-white py-4 pr-4 border-b border-solid border-custom-gray">
      {children}
    </div>
  );
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="flex-1 min-w-0 font-roboto font-normal text-text-default text-[22px] leading-7 truncate">
      {children}
    </h1>
  );
}

export function DetailTopbar({
  title,
  description,
  type,
  isBookmarked,
  showDetailModal,
  onBack,
  onCancle,
  onBookmark,
  setShowDetailModal,
}: DetailTopbarProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast, showToast, hideToast } = useToast();

  const clipUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast({ message: 'URL copied to clipboard!', type: 'success' });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getCleanShareUrl = () => {
    const baseUrl = getBaseUrl();
    const path = location.pathname;
    const normalizedPath = path.endsWith('/') ? path : `${path}/`;

    const tabParam = searchParams.get('tab');
    const cleanTab = tabParam?.replace(/\s+/g, '') || '';

    let queryString = '';
    if (cleanTab) {
      queryString = `?tab=${encodeURIComponent(cleanTab)}`;
    }

    return `${baseUrl}${normalizedPath}${queryString}`;
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && window.ReactNativeWebView) {
      const shareData = {
        action: 'shareContent',
        title: title,
        url: getCleanShareUrl().replace(/\/\/www\./g, '//'),
        description: description,
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(shareData));
    } else {
      clipUrl(getCleanShareUrl());
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={hideToast} />}
      <DetailTopbarWrapper>
        <div className="flex items-center gap-2 flex-1 min-w-0">
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

        <div className="flex items-center justify-center gap-2 w-[160px]">
          {/* 북마크 */}
          <button
            onClick={onBookmark}
            className="w-12 h-12 flex items-center justify-center transition-colors hover:[&>svg]:text-[#6952F9]"
          >
            <span className="sr-only">bookmark</span>
            {isBookmarked ? (
              <FaBookmark className="w-6 h-6 text-[#6952F9] fill-current" />
            ) : (
              <FaRegBookmark className="w-6 h-6 text-text-default stroke-current" />
            )}
          </button>
          {/* 공유하기 */}
          <button className="w-12 h-12 flex items-center justify-center" onClick={handleShare}>
            <span className="sr-only">share icon</span>
            <ShareIcon />
          </button>
          {/* 메뉴 */}
          <button
            className="w-12 h-12 flex items-center justify-center"
            onClick={() => setShowDetailModal(!showDetailModal)}
          >
            <span className="sr-only">menu</span>
            <HanburgerMenu />
          </button>
        </div>
      </DetailTopbarWrapper>
    </>
  );
}
