import { Logo, AlarmIcon, ProfileIcon } from '@/components/shared/icon';
import { useState } from 'react';
import { cn } from '@/utils/utils';

interface AdminTopbarProps {
  userName?: string;
  onLogout?: () => void;
}

export const AdminTopbar = ({ userName = '관리자', onLogout }: AdminTopbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout?.();
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-white shadow-default sticky top-0 z-30">
      {/* Left: Logo + Admin Badge */}
      <div className="flex items-center gap-3">
        <Logo className="text-text-brand-default" />
        <span className="px-3 py-1 bg-bg-brand-weak text-text-brand-default text-label-300-heavy rounded-full">
          관리자
        </span>
      </div>

      {/* Right: Alarm + Profile */}
      <div className="flex items-center gap-4">
        {/* Alarm Icon */}
        <button className="p-2 hover:bg-bg-highlight-hover rounded-lg transition-colors relative">
          <AlarmIcon />
          {/* Notification Badge */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-bg-danger-default rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-2 hover:bg-bg-highlight-hover rounded-lg transition-colors"
          >
            <ProfileIcon />
            <span className="text-body-200-medium text-text-default">{userName}</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />

              {/* Dropdown Content */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-selected border border-border-weak2 py-2 z-50">
                <button
                  onClick={handleLogout}
                  className={cn(
                    'w-full px-4 py-2 text-left text-body-200-medium text-text-default',
                    'hover:bg-bg-highlight-hover transition-colors'
                  )}
                >
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
