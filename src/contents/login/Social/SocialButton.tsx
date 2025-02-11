import { cn } from '@/utils/utils';

interface SocialButtonProps {
  logo: React.ReactNode;
  title: string;
  type: string;
}

export function SocialButton({ logo, title, type }: SocialButtonProps) {
  return (
    <div
      className={cn(
        'w-full h-14 p-4 rounded-xl flex items-center justify-start cursor-pointer',
        `${type === 'kakao' ? 'bg-bg-kakao' : 'bg-bg-default border-2 border-border-default'}`
      )}
    >
      <div>{logo}</div>
      <div className="w-full flex items-center justify-center text-text-default text-body-100-light">
        <p>{title}</p>
      </div>
    </div>
  );
}
