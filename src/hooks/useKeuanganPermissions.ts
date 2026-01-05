// src/hooks/useKeuanganPermissions.ts
'use client';

import { useAuth } from './useAuth';
import { useMemo } from 'react';

/**
 * Hook to check keuangan module permissions
 *
 * Full access roles: admin, sekretariat
 * Read-only access roles: pembina, pengawas, pengurus, kepalabidang, kepalaunit
 */
export function useKeuanganPermissions() {
  const { user, isAuthenticated } = useAuth();

  // Roles with full access (can create, edit, delete)
  const FULL_ACCESS_ROLES = ['admin', 'sekretariat'];

  // Roles with read-only access (can only view)
  const READ_ONLY_ROLES = ['pembina', 'pengawas', 'pengurus', 'kepalabidang', 'kepalaunit'];

  // Check if user has full access
  const hasFullAccess = useMemo(() => {
    if (!isAuthenticated || !user?.role) return false;
    return FULL_ACCESS_ROLES.includes(user.role);
  }, [isAuthenticated, user]);

  // Check if user has read-only access
  const hasReadOnlyAccess = useMemo(() => {
    if (!isAuthenticated || !user?.role) return false;
    return READ_ONLY_ROLES.includes(user.role);
  }, [isAuthenticated, user]);

  // Check if user can write (create, edit, delete)
  const canWrite = useMemo(() => hasFullAccess, [hasFullAccess]);

  // Check if user can read
  const canRead = useMemo(
    () => hasFullAccess || hasReadOnlyAccess,
    [hasFullAccess, hasReadOnlyAccess]
  );

  return {
    hasFullAccess,
    hasReadOnlyAccess,
    canWrite,
    canRead,
    userRole: user?.role,
  };
}
