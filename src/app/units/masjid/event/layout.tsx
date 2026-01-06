// src/app/units/masjid/event/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events - Masjid Al Muhajirin Rewwin',
  description: 'Event dan kegiatan Masjid Al Muhajirin Rewwin',
};

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout overrides the parent layout's navbar and footer
  // by rendering in a separate container outside the parent's flex structure
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto">
      {children}
    </div>
  );
}
