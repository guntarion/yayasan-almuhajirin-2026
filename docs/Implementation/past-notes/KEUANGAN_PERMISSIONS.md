# Keuangan Module - Role-Based Access Control (RBAC)

## Overview

The keuangan module (Financial Management System) at `keuangan.muhajirinrewwin.or.id` is now protected with role-based access control. Only authenticated users with specific roles can access this module.

## User Roles

The system now supports the following user roles:

### Organizational Roles
1. **admin** - Full system access
2. **pengurus** - Organization management
3. **pengawas** - Supervisory role
4. **pembina** - Advisory role
5. **kepalabidang** - Division head
6. **kepalaunit** - Unit head
7. **operatorunit** - Unit operator
8. **sekretariat** - Secretariat

### General Roles
9. **member** - Regular member
10. **moderator** - Content moderator
11. **editor** - Content editor
12. **viewer** - Read-only viewer
13. **guest** - Guest access

## Keuangan Module Access Levels

### Full Access (Read & Write)
These roles have complete access to create, read, update, and delete financial data:
- **admin**
- **sekretariat**

### Read-Only Access
These roles can only view financial data but cannot create, edit, or delete:
- **pembina**
- **pengawas**
- **pengurus**
- **kepalabidang**
- **kepalaunit**

## Implementation Details

### 1. Authentication Protection

The keuangan module layout (`src/app/keuangan/layout.tsx`) uses `RoleGuard` to ensure only authenticated users with proper roles can access:

```typescript
const ALLOWED_ROLES = [
  'admin',
  'sekretariat',
  'pembina',
  'pengawas',
  'pengurus',
  'kepalabidang',
  'kepalaunit',
];

<RoleGuard allowedRoles={ALLOWED_ROLES} fallbackUrl="/auth/unauthorized">
  {/* Keuangan content */}
</RoleGuard>
```

### 2. Permission Hook

Use the `useKeuanganPermissions` hook in your components to check permissions:

```typescript
import { useKeuanganPermissions } from '@/hooks/useKeuanganPermissions';

function MyKeuanganPage() {
  const { canWrite, canRead, hasFullAccess, hasReadOnlyAccess } = useKeuanganPermissions();

  return (
    <div>
      {/* Show content to all authorized users */}
      {canRead && <FinancialReports />}

      {/* Show create/edit buttons only to users with write access */}
      {canWrite && (
        <Button onClick={handleCreate}>Create Transaction</Button>
      )}

      {/* Alternative: Check specific access level */}
      {hasFullAccess && <AdminControls />}
      {hasReadOnlyAccess && <ViewOnlyBadge />}
    </div>
  );
}
```

### 3. Conditional UI Example

Here's a complete example showing how to conditionally render UI elements:

```typescript
'use client';

import { useKeuanganPermissions } from '@/hooks/useKeuanganPermissions';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash } from 'lucide-react';

export default function TransactionListPage() {
  const { canWrite, hasReadOnlyAccess } = useKeuanganPermissions();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Daftar Transaksi</h1>

        {/* Only show "Create New" button for users with write access */}
        {canWrite && (
          <Button>
            <Plus className="mr-2" />
            Transaksi Baru
          </Button>
        )}

        {/* Show read-only badge for users with limited access */}
        {hasReadOnlyAccess && (
          <Badge variant="secondary">Read-Only Access</Badge>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            {canWrite && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
              {canWrite && (
                <td>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash className="h-4 w-4" />
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Updating User Roles

### Via Prisma Studio (Development)

1. Run Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Navigate to the `User` model

3. Find the user you want to update

4. Change the `role` field to one of the valid roles

5. Save the changes

### Via Database Migration (Production)

To update a user's role in production, you can:

1. Use Prisma Studio (if accessible)
2. Run a direct database query:
   ```sql
   UPDATE users
   SET role = 'sekretariat'
   WHERE email = 'user@example.com';
   ```

3. Or create an admin interface for role management

## Migration Applied

The database schema has been updated with the new roles. Migration file:
- `prisma/migrations/20260105145404_add_organizational_roles/migration.sql`

## Testing

To test the permissions:

1. **Test Full Access:**
   - Sign in as a user with `admin` or `sekretariat` role
   - Verify you can access all CRUD operations

2. **Test Read-Only Access:**
   - Sign in as a user with `pembina`, `pengawas`, `pengurus`, `kepalabidang`, or `kepalaunit` role
   - Verify you can view data but create/edit/delete buttons are hidden

3. **Test Unauthorized Access:**
   - Sign in as a user with `member` or `guest` role
   - Verify you are redirected to `/auth/unauthorized`

4. **Test Unauthenticated Access:**
   - Sign out completely
   - Try accessing `keuangan.muhajirinrewwin.or.id`
   - Verify you are redirected to login page

## Important Notes

- Users with `admin` role always have full access to all modules
- The `useAuth` hook's `hasRole` function automatically grants access to admins
- Make sure to use the `useKeuanganPermissions` hook consistently across all keuangan pages
- For API routes, implement server-side permission checks as well

## Files Modified/Created

1. ✅ `prisma/schema.prisma` - Updated Role enum
2. ✅ `src/app/api/auth/[...nextauth]/options.ts` - Updated role types
3. ✅ `src/app/keuangan/layout.tsx` - Added RoleGuard
4. ✅ `src/hooks/useKeuanganPermissions.ts` - Created permission hook
5. ✅ `prisma/migrations/20260105145404_add_organizational_roles/` - Migration applied

## Next Steps

To fully implement read-only restrictions, update each keuangan page to:

1. Import and use `useKeuanganPermissions` hook
2. Conditionally render create/edit/delete buttons based on `canWrite`
3. Add read-only badges or notifications for users with limited access
4. Implement server-side permission checks in API routes

Example pages to update:
- `/keuangan/transaksi/page.tsx`
- `/keuangan/program/page.tsx`
- `/keuangan/pengaturan/akun/page.tsx`
- All edit and create pages
