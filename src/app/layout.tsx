import React, { Suspense } from 'react';
import { Inter } from 'next/font/google';
import 'simplebar-react/dist/simplebar.min.css';
import './css/globals.css';
import ClientLayout from './client-layout';
import { metadata } from './metadata';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import FacebookPixel from '@/components/shared/FacebookPixel';

const inter = Inter({ subsets: ['latin'] });

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
      </head>
      <body className={`${inter.className}`}>
        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
