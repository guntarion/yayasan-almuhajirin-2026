// src/components/units/kbtk/ConditionalLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import { KBTKNavbar } from './Navbar';
import { KBTKFooter } from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

/**
 * Conditionally renders navbar and footer based on pathname.
 * Hides them when in /kelola section (admin area has its own layout).
 */
export function KBTKConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Hide navbar/footer in kelola (admin) section
  const isKelolaSection = pathname?.includes('/kelola');

  if (isKelolaSection) {
    // Kelola section - render children only (kelola has its own layout)
    return <>{children}</>;
  }

  // Public website - render with navbar and footer
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <KBTKNavbar />
      <main className="flex-1">{children}</main>
      <KBTKFooter />
    </div>
  );
}
