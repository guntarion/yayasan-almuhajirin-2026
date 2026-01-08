'use client';

import KeuanganNavbar from '@/components/keuangan/KeuanganNavbar';
import RoleGuard from '@/components/auth/RoleGuard';

// Note: metadata cannot be exported from client components
// If you need metadata, create a separate server component wrapper

// Roles allowed to access keuangan module
const ALLOWED_ROLES = [
  'admin',
  'sekretariat',
  'pembina',
  'pengawas',
  'pengurus',
  'kepalabidang',
  'kepalaunit',
];

export default function KeuanganLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={ALLOWED_ROLES} fallbackUrl="/auth/unauthorized">
      <div className="min-h-screen bg-gradient-to-br from-[#B2EBF2]/5 via-white to-[#80DEEA]/5">
        <KeuanganNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
        <footer className="border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-500">
              Kesekretariatan &copy; 2025 - Yayasan Al Muhajirin Rewwin
            </p>
          </div>
        </footer>
      </div>
    </RoleGuard>
  );
}
