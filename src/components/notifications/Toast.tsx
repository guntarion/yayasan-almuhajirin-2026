'use client';

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: ToastType;
  duration?: number;
}

export default function Toast({ isOpen, onClose, message, type = 'info', duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconColor: 'text-green-600',
    },
    error: {
      icon: XCircle,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-600',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-600',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-600',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className='fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300'>
      <div
        className={`${config.bg} ${config.border} border-2 rounded-xl shadow-lg p-4 max-w-md flex items-start gap-3`}
      >
        <Icon className={`h-6 w-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <p className={`${config.text} font-medium flex-1`}>{message}</p>
        <button
          onClick={onClose}
          className={`${config.text} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <X className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
}
