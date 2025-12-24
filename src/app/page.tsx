// src/app/page.tsx
import { Suspense } from 'react';
import { Navbar } from '@/components/website/Navbar';
import { Footer } from '@/components/website/Footer';
import LandingPage from './(WebsiteLayout)/landingpage';

/**
 * Root page - Yayasan Al Muhajirin Landing Page
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-16 bg-background"></div>}>
        <Navbar />
      </Suspense>
      <main className="flex-grow">
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
}
