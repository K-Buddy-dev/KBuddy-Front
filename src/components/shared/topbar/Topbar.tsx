import { CancelIcon, PreviewBackIcon } from '@/components/shared/icon';

interface TopbarProps {
  title: string;
  type: 'cancel' | 'back';
  next?: string;
  isNext?: boolean;
  onBack?: () => void;
  onCancle?: () => void;
  onNext?: () => void;
}

function TopbarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-0 left-0 flex items-center justify-between w-full h-14 bg-white py-4 pr-4 border-b border-solid border-custom-gray">
      {children}
    </div>
  );
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="flex-1 font-roboto font-normal text-text-default text-[22px] leading-7">{children}</h1>;
}

export function Topbar({ title, type, next, isNext, onBack, onCancle, onNext }: TopbarProps) {
  return (
    <TopbarWrapper>
      <div className="flex items-center justify-start gap-2">
        {type === 'cancel' && (
          <button type="button" onClick={onCancle}>
            <CancelIcon />
          </button>
        )}
        {type === 'back' && (
          <button type="button" onClick={onBack}>
            <PreviewBackIcon />
          </button>
        )}
        <PageTitle>{title}</PageTitle>
      </div>
      <div>
        {next && (
          <button
            className={`font-roboto text-[22px] font-normal ${isNext ? ' text-text-brand-default' : ' text-text-disabled'}`}
            type="button"
            onClick={onNext}
          >
            {next}
          </button>
        )}
      </div>
    </TopbarWrapper>
  );
}
