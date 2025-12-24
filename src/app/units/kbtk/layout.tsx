// src/app/units/kbtk/layout.tsx
import { Metadata } from 'next';
import { KBTKNavbar, KBTKFooter } from '@/components/units/kbtk';

export const metadata: Metadata = {
  title: {
    default: 'KBTK Al Muhajirin Rewwin - Kelompok Bermain & Taman Kanak-Kanak',
    template: '%s | KBTK Al Muhajirin Rewwin',
  },
  description: 'KBTK Al Muhajirin Rewwin - Lembaga pendidikan anak usia dini dengan metode BCCT dan pendekatan Islami Montessori. Membimbing anak beraqidah mantap, berakhlak karimah, dan berprestasi optimal.',
  keywords: ['KBTK', 'TK', 'Taman Kanak-Kanak', 'Kelompok Bermain', 'PAUD', 'Al Muhajirin', 'Rewwin', 'Waru', 'Sidoarjo', 'Islami', 'Montessori', 'BCCT'],
  authors: [{ name: 'Yayasan Al Muhajirin Rewwin' }],
  openGraph: {
    title: 'KBTK Al Muhajirin Rewwin',
    description: 'Lembaga pendidikan anak usia dini dengan metode BCCT dan pendekatan Islami Montessori',
    url: 'https://kbtk.almuhajirin.or.id',
    siteName: 'KBTK Al Muhajirin Rewwin',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function KBTKLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <KBTKNavbar />
      <main className="flex-1">{children}</main>
      <KBTKFooter />
    </div>
  );
}
