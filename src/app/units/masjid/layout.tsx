import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Ketakmiran Masjid Al Muhajirin',
  description: 'Unit Ketakmiran Masjid Al Muhajirin Rewwin Waru Sidoarjo',
};

export default function MasjidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header khusus unit masjid bisa ditambahkan di sini */}
      {children}
    </div>
  );
}
