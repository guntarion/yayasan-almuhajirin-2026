// src/app/units/poliklinik/layout.tsx
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Poliklinik Al Muhajirin - Layanan Kesehatan Gratis',
    template: '%s | Poliklinik Al Muhajirin',
  },
  description:
    'Poliklinik Al Muhajirin menyediakan layanan kesehatan gratis untuk masyarakat sekitar Masjid Al Muhajirin Rewwin, Waru, Sidoarjo. Jadwal pelayanan: Selasa & Jumat pukul 09.00 WIB.',
  keywords: [
    'Poliklinik',
    'Al Muhajirin',
    'Rewwin',
    'Waru',
    'Sidoarjo',
    'Layanan Kesehatan',
    'Kesehatan Gratis',
    'Klinik Masjid',
    'Yayasan Al Muhajirin',
  ],
  openGraph: {
    title: 'Poliklinik Al Muhajirin - Layanan Kesehatan Gratis',
    description:
      'Layanan kesehatan gratis untuk masyarakat sekitar Masjid Al Muhajirin Rewwin.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function PoliklinikLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
