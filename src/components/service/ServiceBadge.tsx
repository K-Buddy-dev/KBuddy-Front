interface ServiceBadgeProps {
  type: 'new' | 'trending';
}

export const ServiceBadge: React.FC<ServiceBadgeProps> = ({ type }) => {
  const isNew = type === 'new';

  return (
    <div
      className={`flex h-[18px] flex-col justify-center items-end gap-1 rounded-2xl ${
        isNew
          ? 'border border-border-brand-default bg-bg-brand-weak'
          : 'border border-border-danger-default bg-bg-danger-weak'
      }`}
    >
      <div className="flex h-[17px] px-2 justify-end items-center gap-1">
        <span
          className={`text-right font-roboto text-label-300-heavy font-semibold leading-3 tracking-[0.24px] ${
            isNew ? 'text-text-brand-default' : 'text-text-danger-default'
          }`}
        >
          {isNew ? 'New' : 'Trending'}
        </span>
      </div>
    </div>
  );
};
