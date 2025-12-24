import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Kolam Renang - Al Muhajirin',
  description: 'Unit Kolam Renang Yayasan Al Muhajirin Rewwin Waru Sidoarjo',
};

export default function PoolLayout({
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
