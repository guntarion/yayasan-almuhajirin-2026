// src/app/auth/login/page.tsx
import React, { Suspense } from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import AuthLogin from '../authforms/AuthLogin';

export const metadata: Metadata = {
  title: 'Masuk - Yayasan Al Muhajirin Rewwin',
  description: 'Sistem Informasi Terpadu Yayasan Al Muhajirin Rewwin',
};

// Loading component for Suspense fallback
const AuthLoginLoading = () => (
  <div className='p-4 rounded-md bg-gray-100 animate-pulse'>
    <div className='h-8 bg-gray-200 rounded mb-4'></div>
    <div className='h-8 bg-gray-200 rounded mb-4'></div>
    <div className='h-8 bg-gray-200 rounded'></div>
  </div>
);

const BoxedLogin = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#B2EBF2]/20 via-white to-[#80DEEA]/20'>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#80DEEA]/20 to-[#B2EBF2]/20 blur-3xl"></div>
      </div>

      <div className='container mx-auto px-4 py-10 relative z-10'>
        <div className='flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]'>
          <div className='w-full max-w-md'>
            {/* Logo */}
            <div className='flex justify-center mb-8'>
              <div className='relative'>
                <Image
                  src="/images/Logo-YAMR.png"
                  alt="Logo Yayasan Al Muhajirin Rewwin"
                  width={120}
                  height={120}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Login Card */}
            <div className='bg-white shadow-2xl rounded-2xl overflow-hidden border border-[#00BCD4]/10'>
              <div className='px-8 py-10'>
                <header className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-[#006064] mb-2">
                    Selamat Datang
                  </h1>
                  <p className="text-gray-600">
                    Yayasan Al Muhajirin Rewwin
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Sistem Informasi Terpadu
                  </p>
                </header>

                {/* Wrap AuthLogin in Suspense to handle useSearchParams */}
                <Suspense fallback={<AuthLoginLoading />}>
                  <AuthLogin />
                </Suspense>
              </div>
            </div>

            <footer className="mt-8 text-center text-gray-600 text-sm">
              <p>&copy; {new Date().getFullYear()} Yayasan Al Muhajirin Rewwin</p>
              <p className="text-xs text-gray-500 mt-1">Jl. Rewwin, Kec. Waru, Kab. Sidoarjo</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxedLogin;
