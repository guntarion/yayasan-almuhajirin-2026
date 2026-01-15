// src/app/units/masjid/ramadhan/sponsorship/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Proposal Sponsorship Run-Madan 2026 - Masjid Al Muhajirin Rewwin',
    template: '%s - Masjid Al Muhajirin Rewwin',
  },
  description: 'Proposal sponsorship untuk kegiatan Run-Madan 2026 - Edu Run & Edukasi Kesehatan dalam rangka menyambut Ramadhan 1447H. Masjid Al Muhajirin Rewwin.',
  keywords: ['run-madan', 'sponsorship', 'sponsor', 'ramadhan', 'masjid', 'al muhajirin', 'rewwin', '2026', 'lari', 'kesehatan'],
};

export default function SponsorshipLayout({
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
