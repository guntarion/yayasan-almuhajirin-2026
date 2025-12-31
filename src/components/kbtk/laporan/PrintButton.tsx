// src/components/kbtk/laporan/PrintButton.tsx
'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrintButtonProps {
  className?: string;
}

export function PrintButton({ className }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      onClick={handlePrint}
      variant="outline"
      className={`no-print ${className || ''}`}
    >
      <Printer className="h-4 w-4 mr-2" />
      Cetak Laporan
    </Button>
  );
}

export default PrintButton;
