import { cn } from '@/utils/utils';
import { ReactNode, cloneElement, isValidElement } from 'react';

interface MenuItemProps {
  id: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const MenuItem = ({ label, icon, active = false, onClick }: MenuItemProps) => {
  // Clone icon element and pass isActive prop
  const iconWithProps = isValidElement(icon) ? cloneElement(icon, { isActive: active } as any) : icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full px-4 py-3 flex items-center gap-3 rounded-lg',
        'text-body-200-medium transition-colors',
        active
          ? 'bg-bg-brand-weak text-text-brand-default'
          : 'text-text-default hover:bg-bg-highlight-hover active:bg-bg-highlight-pressed'
      )}
    >
      <span className="flex-shrink-0">{iconWithProps}</span>
      <span>{label}</span>
    </button>
  );
};
