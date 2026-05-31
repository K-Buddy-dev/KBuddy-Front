export function TabWrapper({
  children,
  type = 'primary',
}: {
  children: React.ReactNode;
  type?: 'primary' | 'secondary';
}) {
  const bgClass = type === 'primary' ? 'bg-gradient-to-r from-bg-brand-light to-bg-brand-default' : 'bg-white';
  return <div className={`mx-auto flex items-start min-w-[280px] w-full h-[50px] ${bgClass}`}>{children}</div>;
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 h-full flex items-center">{children}</div>;
}
