import type { Metadata } from 'next';
import KeuanganNavbar from '@/components/keuangan/KeuanganNavbar';

export const metadata: Metadata = {
  title: 'Keuangan YAMR - Yayasan Al Muhajirin',
  description: 'Sistem Pengelolaan Keuangan Yayasan Al Muhajirin Rewwin',
};

export default function KeuanganLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B2EBF2]/5 via-white to-[#80DEEA]/5">
      <KeuanganNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
      <footer className="border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Keuangan YAMR - Yayasan Al Muhajirin Rewwin Waru Sidoarjo
          </p>
        </div>
      </footer>
    </div>
  );
}
