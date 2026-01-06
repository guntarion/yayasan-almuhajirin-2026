// src/app/units/masjid/ramadhan/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ramadhan 1447 H - Masjid Al Muhajirin Rewwin',
  description: 'Program Ramadhan 1447 H Masjid Al Muhajirin Rewwin: RAMADHAN MADRASAH KITA - Membangun PRIBADI TAQWA, Mewujudkan Kontribusi MULIA',
  keywords: 'ramadhan, masjid al muhajirin, rewwin, program ramadhan, takjil, tarawih, kajian ramadhan',
};

export default function RamadhanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
