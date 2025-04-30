import { AlarmIcon, Logo, SearchIcon, SettingsIcon } from '@/components/shared/icon';

function NavSearch() {
  return (
    <div className="flex items-center gap-2 w-full sm:w-[496px] h-9 py-1.5 pl-2 rounded-full bg-white">
      <SearchIcon />
      <input type="text" placeholder="Search KBuddy" className="block h-full outline-none rounded-full" />
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

function NavbarWithSearch() {
  return (
    <NavWrapper>
      <Logo />
      <NavSearch />
      <AlarmIcon />
    </NavWrapper>
  );
}

function NavbarWithoutSearch() {
  return (
    <NavWrapper>
      <div className="flex justify-between w-full">
        <Logo />
        <div className="flex">
          <AlarmIcon />
          <SettingsIcon primary={false} />
        </div>
      </div>
    </NavWrapper>
  );
}

export function Navbar({ withSearch }: { withSearch: boolean }) {
  return withSearch ? <NavbarWithSearch /> : <NavbarWithoutSearch />;
}
