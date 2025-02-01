import React from 'react';

export function IconWrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-12 h-12 flex items-center justify-center">{children}</div>;
}
