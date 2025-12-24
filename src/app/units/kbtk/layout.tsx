import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KBTK Al Muhajirin',
  description: 'Kelompok Bermain dan Taman Kanak-Kanak Al Muhajirin Rewwin',
};

export default function KbtkLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
