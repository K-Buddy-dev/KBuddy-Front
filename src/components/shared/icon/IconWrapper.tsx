import { cn } from '@/utils/utils';
import React from 'react';

interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function IconWrapper({ children, className, onClick }: IconWrapperProps) {
  return (
    <div className={cn('w-9 h-9 xs:w-12 xs:h-12 flex items-center justify-center', className)} onClick={onClick}>
      {children}
    </div>
  );
}
