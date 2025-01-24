import { CancleIcon } from '../icon/Icon.tsx';

function TopbarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-0 left-0 flex items-center justify-between w-[360px] h-14 bg-white py-4 pr-4 border-b border-solid border-custom-gray">
      {children}
    </div>
  );
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="flex-1 text-text-primary font-roboto text-[22px] font-normal leading-7">{children}</h1>;
}

export function Topbar({ title }: { title: string }) {
  return (
    <TopbarWrapper>
      <CancleIcon />
      <PageTitle>{title}</PageTitle>
    </TopbarWrapper>
  );
}
