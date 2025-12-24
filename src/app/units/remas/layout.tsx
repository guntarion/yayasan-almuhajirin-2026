import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Remaskidz - Al Muhajirin',
  description: 'Remaja Masjid Al Muhajirin Rewwin Waru Sidoarjo',
};

export default function RemasLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
