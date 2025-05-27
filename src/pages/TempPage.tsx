import { useEffect, useState } from 'react';
import { SettingsIcon } from '@/components/shared/icon';

export function TempPage() {
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
        <SettingsIcon primary={true} />
      </div>

      <h1 className="text-2xl font-medium text-text-default mb-3">We're getting ready for you{dots}</h1>
      <p className="text-center text-text-weak mb-8">
        We're working hard to bring you a better experience.
        <br />
        We'll be with you shortly.
      </p>

      <div className="text-sm text-text-weak">
        <span className="text-text-brand-default font-medium">KBuddy</span> Team
      </div>
    </div>
  );
}
