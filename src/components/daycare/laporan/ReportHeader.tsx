// src/components/daycare/laporan/ReportHeader.tsx
'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrintButton } from './PrintButton';

interface ReportHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  filterSlot?: ReactNode;
  showPrint?: boolean;
  printTitle?: string;
  children?: ReactNode;
}

export function ReportHeader({
  title,
  subtitle,
  backHref = '/units/daycare/kelola/laporan',
  filterSlot,
  showPrint = true,
  printTitle,
  children,
}: ReportHeaderProps) {
  return (
    <>
      {/* Screen Header */}
      <div className="no-print space-y-4">
        {/* Back Link & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-gray-600 hover:text-[#006064] hover:bg-[#B2EBF2]/30 rounded-xl"
            >
              <Link href={backHref}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
                <h1 className="text-2xl font-bold text-[#006064]">{title}</h1>
              </div>
              {subtitle && (
                <p className="text-gray-600 ml-4 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showPrint && <PrintButton title={printTitle || title} />}
            {children}
          </div>
        </div>

        {/* Filter Section */}
        {filterSlot && (
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm">
            {filterSlot}
          </div>
        )}
      </div>

      {/* Print Header - Only visible when printing */}
      <div className="print-only hidden">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
          <div className="flex items-center gap-4">
            <Image
              src="/images/Logo-YAMR.png"
              alt="Daycare Al Muhajirin"
              width={60}
              height={60}
              className="rounded-xl"
            />
            <div>
              <h1 className="text-lg font-bold text-[#006064]">
                Daycare Al Muhajirin
              </h1>
              <p className="text-sm text-gray-600">
                Yayasan Al Muhajirin Rewwin
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <FileText className="h-5 w-5 text-[#006064]" />
              <h2 className="text-lg font-bold text-[#006064]">{printTitle || title}</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Dicetak: {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
