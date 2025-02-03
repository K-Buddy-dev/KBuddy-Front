import { AlarmIcon, Logo, SearchIcon, SettingsIcon } from '@/components/icon';

function NavSearch() {
  return (
    <div className="flex items-center gap-2 w-[252px] h-9 py-1.5 pl-2 rounded-full bg-white">
      <SearchIcon />
      <input type="text" placeholder="Search KBuddy" className="h-full outline-none" />
    </div>
  );
}

function NavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <nav className="flex items-center justify-between w-[360px] h-14 bg-gradient-to-r from-primary-light to-primary py-2 pr-1">
      <Logo />
      {children}
    </nav>
  );
}

function NavbarWithSearch() {
  return (
    <NavWrapper>
      <NavSearch />
      <AlarmIcon />
    </NavWrapper>
  );
}

function NavbarWithoutSearch() {
  return (
    <NavWrapper>
      <div className="flex">
        <AlarmIcon />
        <SettingsIcon />
      </div>
    </NavWrapper>
  );
}

export function Navbar({ withSearch }: { withSearch: boolean }) {
  return withSearch ? <NavbarWithSearch /> : <NavbarWithoutSearch />;
}
