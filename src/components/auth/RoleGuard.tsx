// src/components/auth/RoleGuard.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackUrl?: string;
}

/**
 * Component to protect routes based on user roles
 * - If user is not authenticated → redirect to login
 * - If user is authenticated but lacks role → redirect to unauthorized
 */
export default function RoleGuard({ children, allowedRoles, fallbackUrl = '/auth/unauthorized' }: RoleGuardProps) {
  const { hasRole, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until authentication status is determined
    if (!isLoading) {
      if (!isAuthenticated) {
        // User is not logged in → redirect to login with callback
        // Use the current full path (including subdomains will be handled by browser)
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
        const callbackUrl = encodeURIComponent(currentPath);
        router.push(`/auth/login?callbackUrl=${callbackUrl}`);
      } else if (!hasRole(allowedRoles)) {
        // User is logged in but doesn't have required role → unauthorized
        router.push(fallbackUrl);
      }
    }
  }, [isAuthenticated, hasRole, isLoading, router, allowedRoles, fallbackUrl, pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // Show content if user has required role
  if (isAuthenticated && hasRole(allowedRoles)) {
    return <>{children}</>;
  }

  // Show nothing while redirecting
  return null;
}
