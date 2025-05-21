import { AlarmIcon, Logo, SearchIcon, SettingsIcon } from '@/components/shared/icon';
import { Dispatch, SetStateAction, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
    <div className="flex items-center gap-2 w-full sm:w-[496px] h-9 py-1.5 pl-2 rounded-full bg-white">
      <button type="button" onClick={handleSearch} aria-label="Search" className="flex items-center justify-center">
        <SearchIcon />
      </button>
      <input
        type="text"
        value={inputValue}
        placeholder="Search KBuddy"
        className="block h-full outline-none rounded-full flex-1"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function NavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <nav className="flex items-center justify-between xs:justify-center w-full h-14 bg-gradient-to-r from-bg-brand-light to-bg-brand-default py-2 pr-1">
      {children}
    </nav>
  );
}

function NavbarWithSearch({ setSearchKeyword }: NavbarWithSearchProps) {
  return (
    <NavWrapper>
      <Logo />
      <NavSearch setSearchKeyword={setSearchKeyword} />
      <AlarmIcon />
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
        <Logo />
        <div className="flex">
          <AlarmIcon className="cursor-pointer" onClick={onClickAlarm} />
          <SettingsIcon primary={false} className="cursor-pointer" onClick={onClickSettings} />
        </div>
      </div>
    </NavWrapper>
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
