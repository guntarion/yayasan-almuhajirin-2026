import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Usaha & Pengadaan - Al Muhajirin',
  description: 'Unit Usaha & Pengadaan Yayasan Al Muhajirin Rewwin Waru Sidoarjo',
};

export default function UsahaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
