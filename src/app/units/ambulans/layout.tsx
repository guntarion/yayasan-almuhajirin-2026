// src/app/units/ambulans/layout.tsx
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Ambulans Al Muhajirin - Layanan Transportasi Medis',
    template: '%s | Ambulans Al Muhajirin',
  },
  description:
    'Unit Ambulans Al Muhajirin menyediakan layanan transportasi medis darurat 24 jam untuk masyarakat Sidoarjo dan sekitarnya. Hotline: 0859-1807-79439',
  keywords: [
    'Ambulans',
    'Al Muhajirin',
    'Rewwin',
    'Waru',
    'Sidoarjo',
    'Transportasi Medis',
    'Ambulans Gratis',
    'Layanan Darurat',
    'Yayasan Al Muhajirin',
    'Tanggap Bencana',
  ],
  openGraph: {
    title: 'Ambulans Al Muhajirin - Layanan Transportasi Medis 24 Jam',
    description:
      'Layanan transportasi medis darurat untuk masyarakat Sidoarjo dan sekitarnya. Bayar seikhlasnya, gratis untuk yang tidak mampu.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function AmbulansLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
