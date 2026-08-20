import { AlarmIcon, Logo, SearchIcon, SettingsIcon } from '@/components/shared/icon';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notificationService } from '@/services/notificationService';
import { isLoggedIn } from '@/utils/auth';
import { useLoginPrompt } from '@/hooks/useLoginPrompt';

interface NavbarWithSearchProps {
  setSearchKeyword?: Dispatch<SetStateAction<string>>;
}

function NavSearch({ setSearchKeyword }: NavbarWithSearchProps) {
  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(() => {
    return searchParams.get('keyword') || '';
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    if (setSearchKeyword) {
      setSearchKeyword(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full bg-white py-1.5 pl-2 sm:max-w-[496px]">
      <button type="button" onClick={handleSearch} aria-label="Search" className="flex items-center justify-center">
        <SearchIcon />
      </button>
      <input
        type="text"
        value={inputValue}
        placeholder="Search KBuddy"
        className="block h-full min-w-0 flex-1 rounded-full outline-none"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function NavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <nav className="flex h-14 w-full items-center justify-between gap-2 bg-gradient-to-r from-bg-brand-light to-bg-brand-default py-2 pl-2 pr-4">
      {children}
    </nav>
  );
}

function HomeLogoButton({ className }: { className?: string }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-label="Go to home"
      className="flex h-9 w-9 items-center justify-center xs:h-12 xs:w-12"
      onClick={() => navigate('/home')}
    >
      <Logo className={className} />
    </button>
  );
}

function NavbarWithSearch({ setSearchKeyword }: NavbarWithSearchProps) {
  return (
    <NavWrapper>
      <HomeLogoButton className="mr-2 text-white" />
      <NavSearch setSearchKeyword={setSearchKeyword} />
      <NotificationButton />
    </NavWrapper>
  );
}

interface NavbarWithoutSearchProps {
  onClickAlarm?: () => void;
  onClickSettings?: () => void;
}

function NavbarWithoutSearch({ onClickAlarm, onClickSettings }: NavbarWithoutSearchProps) {
  return (
    <NavWrapper>
      <div className="flex justify-between w-full">
        <HomeLogoButton className="text-white" />
        <div className="flex">
          <NotificationButton onClick={onClickAlarm} />
          {onClickSettings && (
            <button
              type="button"
              aria-label="Open settings"
              className="flex h-9 w-9 items-center justify-center xs:h-12 xs:w-12"
              onClick={onClickSettings}
            >
              <SettingsIcon primary={false} />
            </button>
          )}
        </div>
      </div>
    </NavWrapper>
  );
}

function NotificationButton({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const hasUnread = unreadCount > 0;
  const displayCount = unreadCount > 99 ? '99+' : String(unreadCount);
  const { requireLogin } = useLoginPrompt();
  //알림함은 로그인이 필요하다.
  const handleClick =
    onClick ??
    (() => {
      if (!requireLogin('Log in to see your notifications.')) return;
      navigate('/notifications');
    });

  useEffect(() => {
    //게스트는 알림을 조회할 수 없다. 홈/커뮤니티/서비스가 공개되면서
    //호출을 남겨두면 모든 게스트가 페이지마다 401과 토큰 재발급 시도를 발생시킨다.
    if (!isLoggedIn()) {
      return;
    }

    let isMounted = true;

    notificationService
      .getUnreadCount()
      .then((count) => {
        if (isMounted) {
          setUnreadCount(count);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUnreadCount(0);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Open notifications"
      className="relative flex h-9 w-9 shrink-0 items-center justify-center xs:h-12 xs:w-12"
      onClick={handleClick}
    >
      <AlarmIcon color="#FFFFFF" />
      {hasUnread && (
        <span className="absolute right-0.5 top-0.5 min-w-4 rounded-full bg-text-danger-default px-1 text-center text-[10px] font-bold leading-4 text-white xs:right-1 xs:top-1">
          {displayCount}
        </span>
      )}
    </button>
  );
}

interface NavbarProps {
  withSearch: boolean;
  setSearchKeyword?: Dispatch<SetStateAction<string>>;
  onClickAlarm?: () => void;
  onClickSettings?: () => void;
}

export function Navbar({ withSearch, setSearchKeyword, onClickAlarm, onClickSettings }: NavbarProps) {
  return withSearch ? (
    <NavbarWithSearch setSearchKeyword={setSearchKeyword} />
  ) : (
    <NavbarWithoutSearch onClickAlarm={onClickAlarm} onClickSettings={onClickSettings} />
  );
}
