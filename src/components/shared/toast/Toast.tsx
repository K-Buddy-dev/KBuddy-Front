import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircleIcon, XIcon } from '@/components/shared/icon';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'info':
        return 'bg-blue-50';
      default:
        return 'bg-green-50';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-200';
      case 'error':
        return 'border-red-200';
      case 'info':
        return 'border-blue-200';
      default:
        return 'border-green-200';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-green-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon />;
      case 'error':
        return <XIcon />;
      case 'info':
        return <CheckCircleIcon />;
      default:
        return <CheckCircleIcon />;
    }
  };

  return createPortal(
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div
        className={`rounded-lg p-4 flex items-center justify-between ${getBackgroundColor()} border ${getBorderColor()}`}
      >
        <div className="flex items-center">
          <span className={getIconColor()}>{getIcon()}</span>
          <span className="ml-2 text-sm font-normal text-text-default">{message}</span>
        </div>
        <button
          type="button"
          className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={handleClose}
        >
          <span className="sr-only">Close</span>
          <XIcon />
        </button>
      </div>
    </div>,
    document.body
  );
};
