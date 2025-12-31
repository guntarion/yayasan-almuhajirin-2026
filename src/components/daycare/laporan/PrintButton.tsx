// src/components/daycare/laporan/PrintButton.tsx
'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrintButtonProps {
  title?: string;
  className?: string;
}

export function PrintButton({ title = 'Laporan', className }: PrintButtonProps) {
  const handlePrint = () => {
    // Set document title for print filename
    const originalTitle = document.title;
    document.title = title;

    // Trigger print
    window.print();

    // Restore original title
    document.title = originalTitle;
  };

  return (
    <Button
      onClick={handlePrint}
      variant="outline"
      className={`border-2 border-[#00BCD4]/30 text-[#006064] hover:bg-[#B2EBF2]/30 hover:border-[#00BCD4]/50 rounded-xl ${className}`}
    >
      <Printer className="h-4 w-4 mr-2" />
      Cetak Laporan
    </Button>
  );
}

// Additional print styles component for pages
export function PrintStyles() {
  return (
    <style jsx global>{`
      @media print {
        /* Hide non-printable elements */
        .no-print {
          display: none !important;
        }

        /* Show print-only elements */
        .print-only {
          display: block !important;
        }

        /* Page setup */
        @page {
          margin: 1.5cm;
          size: A4;
        }

        /* Reset body styles */
        body {
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Reset main layout */
        main {
          margin-left: 0 !important;
          padding: 0 !important;
        }

        /* Table styles */
        table {
          font-size: 9pt !important;
          width: 100% !important;
          border-collapse: collapse !important;
        }

        th, td {
          padding: 6px 8px !important;
          border: 1px solid #d1d5db !important;
        }

        th {
          background-color: #f3f4f6 !important;
          font-weight: 600 !important;
          text-align: left !important;
        }

        /* Card styles for print */
        .print-card {
          border: 1px solid #e5e7eb !important;
          padding: 12px !important;
          margin-bottom: 12px !important;
          page-break-inside: avoid !important;
        }

        /* Summary box */
        .print-summary {
          background-color: #f0fdfa !important;
          border: 1px solid #99f6e4 !important;
          padding: 16px !important;
          margin-bottom: 16px !important;
        }

        /* Page breaks */
        .page-break {
          page-break-before: always !important;
        }

        .page-break-after {
          page-break-after: always !important;
        }

        .avoid-break {
          page-break-inside: avoid !important;
        }

        /* Badge styles for print */
        .badge-print {
          padding: 2px 6px !important;
          border-radius: 4px !important;
          font-size: 8pt !important;
          font-weight: 500 !important;
        }

        .badge-success {
          background-color: #dcfce7 !important;
          color: #166534 !important;
        }

        .badge-warning {
          background-color: #fef3c7 !important;
          color: #92400e !important;
        }

        .badge-error {
          background-color: #fee2e2 !important;
          color: #991b1b !important;
        }

        /* Hide shadows and rounded corners for print */
        * {
          box-shadow: none !important;
        }

        /* Footer for each page */
        .print-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 8pt;
          color: #6b7280;
          padding: 8px 0;
          border-top: 1px solid #e5e7eb;
        }
      }

      /* Screen-only elements hidden when printing */
      @media screen {
        .print-only {
          display: none !important;
        }
      }
    `}</style>
  );
}
