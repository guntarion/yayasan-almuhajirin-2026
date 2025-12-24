// src/app/units/masjid/layout.tsx
import { Metadata } from 'next';
import { MasjidNavbar, MasjidFooter } from '@/components/units/masjid';

export const metadata: Metadata = {
  title: {
    default: 'Masjid Al Muhajirin Rewwin - Ketakmiran Masjid',
    template: '%s | Masjid Al Muhajirin Rewwin',
  },
  description: 'Masjid Al Muhajirin Rewwin - Pusat ibadah dan kegiatan keagamaan di Waru, Sidoarjo. Memakmurkan masjid melalui kajian rutin, program dakwah, dan pelayanan umat.',
  keywords: ['Masjid', 'Al Muhajirin', 'Rewwin', 'Waru', 'Sidoarjo', 'Kajian', 'Ketakmiran', 'Sholat', 'Islam', 'Pengajian'],
  authors: [{ name: 'Yayasan Al Muhajirin Rewwin' }],
  openGraph: {
    title: 'Masjid Al Muhajirin Rewwin',
    description: 'Pusat ibadah dan kegiatan keagamaan di Waru, Sidoarjo. Memakmurkan masjid melalui kajian rutin, program dakwah, dan pelayanan umat.',
    url: 'https://masjid.almuhajirin.or.id',
    siteName: 'Masjid Al Muhajirin Rewwin',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function MasjidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MasjidNavbar />
      <main className="flex-1">{children}</main>
      <MasjidFooter />
    </div>
  );
}
