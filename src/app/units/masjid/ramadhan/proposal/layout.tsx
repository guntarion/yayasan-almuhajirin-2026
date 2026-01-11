// src/app/units/masjid/ramadhan/proposal/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Proposal Ramadhan 1447H - Masjid Al Muhajirin Rewwin',
    template: '%s - Masjid Al Muhajirin Rewwin',
  },
  description: 'Proposal donasi dan surat pengantar untuk program Ramadhan 1447H Masjid Al Muhajirin Rewwin. Mari bersama memakmurkan Ramadhan dengan donasi Anda.',
  keywords: ['ramadhan', 'donasi', 'masjid', 'al muhajirin', 'rewwin', 'proposal', '1447H'],
};

export default function ProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-100 print:bg-white">
      {children}
    </main>
  );
}
