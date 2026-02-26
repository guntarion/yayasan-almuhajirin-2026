// src/app/units/masjid/ramadhan/tv/layout.tsx
// Layout khusus TV - minimal tanpa header/footer masjid
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Donasi Ramadhan - Smart TV',
  description: 'Tampilan Dashboard Donasi Ramadhan 1447H Masjid Al Muhajirin Rewwin untuk Smart TV',
};

export default function TVLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
