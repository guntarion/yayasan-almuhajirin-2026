// src/app/units/lazmu/layout.tsx
import { Metadata } from 'next';
import { Navbar, Footer } from '@/components/units/lazmu';

export const metadata: Metadata = {
  title: {
    default: 'LAZ Muhajirin - Lembaga Amil Zakat Muhajirin Rewwin',
    template: '%s | LAZ Muhajirin',
  },
  description: 'LAZ Muhajirin (LAZMU) adalah Lembaga Amil Zakat yang beroperasi di bawah naungan Yayasan Al Muhajirin Rewwin, Sidoarjo. Mitra resmi LAZNAS Dewan Dakwah Islamiyah Indonesia Provinsi Jawa Timur.',
  keywords: [
    'LAZ Muhajirin',
    'LAZMU',
    'Lembaga Amil Zakat',
    'Zakat',
    'Infaq',
    'Sedekah',
    'Wakaf',
    'ZISWAF',
    'Sidoarjo',
    'Rewwin',
    'Al Muhajirin',
    'Dewan Dakwah',
    'ambulance gratis',
    'beasiswa pendidikan',
    'poliklinik gratis',
  ],
  openGraph: {
    title: 'LAZ Muhajirin - Lembaga Amil Zakat Muhajirin Rewwin',
    description: 'Salurkan Zakat, Infaq, dan Sedekah Anda melalui LAZ Muhajirin - Lembaga Amil Zakat terpercaya yang amanah dan profesional.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function LazmuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
