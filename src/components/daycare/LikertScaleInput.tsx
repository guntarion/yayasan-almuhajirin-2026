'use client';

import { cn } from '@/lib/utils';
import {
  PERILAKU_SCALE_LABELS,
  AKTIVITAS_SCALE_LABELS,
  MAKAN_SCALE_LABELS,
  TIDUR_SCALE_LABELS,
} from '@/types/daycare';

type ScaleType = 'perilaku' | 'aktivitas' | 'makan' | 'tidur';

interface LikertScaleInputProps {
  type: ScaleType;
  value: number | null | undefined;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const scaleLabels = {
  perilaku: PERILAKU_SCALE_LABELS,
  aktivitas: AKTIVITAS_SCALE_LABELS,
  makan: MAKAN_SCALE_LABELS,
  tidur: TIDUR_SCALE_LABELS,
};

const scaleColors = {
  1: {
    bg: 'bg-red-100 hover:bg-red-200',
    active: 'bg-red-500 text-white ring-2 ring-red-600',
    text: 'text-red-600',
  },
  2: {
    bg: 'bg-orange-100 hover:bg-orange-200',
    active: 'bg-orange-500 text-white ring-2 ring-orange-600',
    text: 'text-orange-600',
  },
  3: {
    bg: 'bg-yellow-100 hover:bg-yellow-200',
    active: 'bg-yellow-500 text-white ring-2 ring-yellow-600',
    text: 'text-yellow-600',
  },
  4: {
    bg: 'bg-lime-100 hover:bg-lime-200',
    active: 'bg-lime-500 text-white ring-2 ring-lime-600',
    text: 'text-lime-600',
  },
  5: {
    bg: 'bg-green-100 hover:bg-green-200',
    active: 'bg-green-500 text-white ring-2 ring-green-600',
    text: 'text-green-600',
  },
};

const sizeClasses = {
  sm: {
    button: 'w-8 h-8 text-sm',
    container: 'gap-1',
  },
  md: {
    button: 'w-10 h-10 text-base',
    container: 'gap-2',
  },
  lg: {
    button: 'w-12 h-12 text-lg',
    container: 'gap-3',
  },
};

export function LikertScaleInput({
  type,
  value,
  onChange,
  label,
  disabled = false,
  showLabels = true,
  size = 'md',
}: LikertScaleInputProps) {
  const labels = scaleLabels[type];
  const sizes = sizeClasses[size];
  const selectedLabel = value ? labels[value as keyof typeof labels] : null;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className={cn('flex items-center', sizes.container)}>
        {[1, 2, 3, 4, 5].map((num) => {
          const colors = scaleColors[num as keyof typeof scaleColors];
          const isSelected = value === num;
          const numLabel = labels[num as keyof typeof labels];

          return (
            <button
              key={num}
              type="button"
              onClick={() => !disabled && onChange(num)}
              disabled={disabled}
              title={numLabel}
              className={cn(
                'rounded-full font-semibold transition-all duration-200 flex items-center justify-center',
                sizes.button,
                isSelected ? colors.active : colors.bg,
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {num}
            </button>
          );
        })}
      </div>
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>{labels[1]}</span>
          <span>{labels[5]}</span>
        </div>
      )}
      {selectedLabel && (
        <p
          className={cn(
            'text-sm font-medium',
            scaleColors[value as keyof typeof scaleColors]?.text
          )}
        >
          {selectedLabel}
        </p>
      )}
    </div>
  );
}

// Display-only version for viewing
interface LikertScaleDisplayProps {
  type: ScaleType;
  value: number | null | undefined;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LikertScaleDisplay({
  type,
  value,
  showLabel = true,
  size = 'sm',
}: LikertScaleDisplayProps) {
  if (!value) {
    return (
      <span className="text-gray-400 text-sm">-</span>
    );
  }

  const labels = scaleLabels[type];
  const colors = scaleColors[value as keyof typeof scaleColors];
  const label = labels[value as keyof typeof labels];
  const sizes = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((num) => {
          const numColors = scaleColors[num as keyof typeof scaleColors];
          const isSelected = value === num;
          const isBefore = num <= value;

          return (
            <div
              key={num}
              className={cn(
                'rounded-full transition-all',
                size === 'sm' ? 'w-5 h-5 text-xs' : sizes.button,
                'flex items-center justify-center font-medium',
                isSelected
                  ? numColors.active
                  : isBefore
                  ? `${numColors.bg} opacity-60`
                  : 'bg-gray-100 text-gray-300'
              )}
            >
              {num}
            </div>
          );
        })}
      </div>
      {showLabel && (
        <span className={cn('text-sm font-medium', colors.text)}>{label}</span>
      )}
    </div>
  );
}

// Compact indicator for cards
interface LikertIndicatorProps {
  value: number | null | undefined;
  label?: string;
}

export function LikertIndicator({ value, label }: LikertIndicatorProps) {
  if (!value) {
    return (
      <div className="flex items-center gap-2">
        {label && <span className="text-xs text-gray-500">{label}:</span>}
        <span className="text-gray-400 text-sm">-</span>
      </div>
    );
  }

  const colors = scaleColors[value as keyof typeof scaleColors];

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-gray-500">{label}:</span>}
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
          colors.active
        )}
      >
        {value}
      </div>
    </div>
  );
}
