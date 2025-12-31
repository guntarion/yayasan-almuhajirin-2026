// src/components/kbtk/laporan/ReportHeader.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface ReportHeaderProps {
  title: string;
  subtitle?: string;
  periodLabel?: string;
}

export function ReportHeader({ title, subtitle, periodLabel }: ReportHeaderProps) {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="print-only hidden print:block mb-6">
      <div className="flex items-center justify-between border-b-2 border-[#006064] pb-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative">
            <Image
              src="/images/kbtk/logo-kbtk.png"
              alt="Logo KBTK"
              width={64}
              height={64}
              className="object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#006064]">KBTK Al Muhajirin Rewwin</h1>
            <p className="text-sm text-gray-600">Kelompok Bermain & Taman Kanak-Kanak</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Tanggal Cetak:</p>
          <p className="text-sm font-medium">{today}</p>
        </div>
      </div>
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        {periodLabel && <p className="text-sm text-gray-600 mt-1">{periodLabel}</p>}
      </div>
    </div>
  );
}

export default ReportHeader;
