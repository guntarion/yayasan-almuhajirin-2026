import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TPQ Al Muhajirin',
  description: 'Taman Pendidikan Al-Quran Al Muhajirin Rewwin',
};

export default function TpqLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
