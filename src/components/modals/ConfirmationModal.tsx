'use client';

import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

type ModalType = 'danger' | 'success' | 'info' | 'warning';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  type = 'info',
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      confirmBg: 'bg-red-600 hover:bg-red-700',
      borderColor: 'border-red-200',
    },
    success: {
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      confirmBg: 'bg-green-600 hover:bg-green-700',
      borderColor: 'border-green-200',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
      borderColor: 'border-yellow-200',
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      confirmBg: 'bg-blue-600 hover:bg-blue-700',
      borderColor: 'border-blue-200',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
      <div
        className='bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className={`p-2 rounded-full ${config.iconBg}`}>
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <h3 className='text-xl font-bold text-gray-900'>{title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50'
          >
            <X className='h-5 w-5 text-gray-500' />
          </button>
        </div>

        {/* Body */}
        <div className='p-6'>
          <p className='text-gray-700 leading-relaxed'>{message}</p>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end gap-3 p-6 bg-gray-50 rounded-b-2xl'>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='px-6 py-3 rounded-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50'
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-semibold text-white ${config.confirmBg} transition-all duration-200 disabled:opacity-50 flex items-center gap-2`}
          >
            {isLoading && (
              <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
