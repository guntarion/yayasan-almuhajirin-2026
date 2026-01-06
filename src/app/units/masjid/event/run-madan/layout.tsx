// src/app/units/masjid/event/run-madan/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Run-Madan 2026 - Tarhib Ramadhan Masjid Al Muhajirin Rewwin',
  description: 'Run-Madan 2026: Event lari 3K & 5K untuk menyambut Ramadhan 1447H. Minggu, 8 Februari 2026 pukul 05:30 WIB di Perumahan Rewwin. Donasi untuk ambulans dan poliklinik Al Muhajirin.',
  keywords: 'run-madan, fun run, lari amal, tarhib ramadhan, masjid al muhajirin, rewwin, lari 3k, lari 5k, senam kesehatan, charity run',
  openGraph: {
    title: 'Run-Madan 2026 - Tarhib Ramadhan Al Muhajirin',
    description: 'Lari 3K & 5K menyambut Ramadhan 1447H. Minggu, 8 Februari 2026. Donasi untuk ambulans dan poliklinik.',
    images: ['/images/masjid/logo-run-madan.png'],
  },
};

export default function RunMadanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
