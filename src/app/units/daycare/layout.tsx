// src/app/units/daycare/layout.tsx
import { Metadata } from 'next';
import React from 'react';
import { DaycareNavbar, DaycareFooter } from '@/components/units/daycare';

export const metadata: Metadata = {
  title: 'Daycare Al Muhajirin Rewwin',
  description: 'Daycare terpercaya dengan pendidikan karakter Islami, fasilitas premium, dan tim pengasuh berpengalaman di Rewwin, Waru, Sidoarjo',
  keywords: ['daycare', 'penitipan anak', 'sidoarjo', 'rewwin', 'waru', 'al muhajirin', 'islami'],
  openGraph: {
    title: 'Daycare Al Muhajirin Rewwin',
    description: 'Daycare terpercaya dengan pendidikan karakter Islami di Rewwin, Waru, Sidoarjo',
    type: 'website',
  },
};

export default function DaycareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DaycareNavbar />
      <main className="flex-1">
        {children}
      </main>
      <DaycareFooter />
    </div>
  );
}
