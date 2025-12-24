import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LAZMU - Lembaga Amil Zakat Al Muhajirin',
  description: 'Lembaga Amil Zakat, Infaq, dan Sedekah Al Muhajirin',
};

export default function LazmuLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
