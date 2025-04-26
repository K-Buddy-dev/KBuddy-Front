import { useEffect, useState } from 'react';
import { SettingsIcon } from '@/components/shared/icon';

export function ProfilePage() {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6">
      <div className="w-24 h-24 bg-bg-brand-weak rounded-full flex items-center justify-center mb-8 animate-spin-slow">
        <SettingsIcon />
      </div>

      <h1 className="text-2xl font-medium text-text-default mb-3">서비스 준비중입니다{dots}</h1>
      <p className="text-center text-text-weak mb-8">
        더 나은 서비스를 제공하기 위해 준비중입니다.
        <br />
        빠른 시일 내에 찾아뵙겠습니다.
      </p>

      <div className="text-sm text-text-weak">
        <span className="text-text-brand-default font-medium">KBuddy</span> 드림
      </div>
    </div>
  );
}
