import React from 'react';

export function IconWrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-9 h-9 xs:w-12 xs:h-12 flex items-center justify-center">{children}</div>;
}
