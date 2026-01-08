# Authentication Flow for Keuangan Module

## Problem Fixed
When accessing the keuangan subdomain (`keuangan.localhost:3000` or `keuangan.muhajirinrewwin.or.id`) without being logged in, users were getting a 404 error instead of being redirected to the login page.

## Root Cause
The middleware was rewriting ALL paths on the keuangan subdomain, including `/auth/*` routes. This meant:
- Request: `keuangan.localhost:3000/auth/unauthorized`
- Was rewritten to: `/keuangan/auth/unauthorized` (which doesn't exist)
- Result: 404 error

## Solution Applied

### 1. Updated Middleware (`src/middleware.ts`)
Added a check to skip rewriting for auth routes:
```typescript
// Skip middleware for auth routes - these should work on any subdomain
if (pathname.startsWith('/auth')) {
  return NextResponse.next();
}
```

### 2. Updated RoleGuard (`src/components/auth/RoleGuard.tsx`)
Enhanced to differentiate between:
- **Unauthenticated users** → Redirect to `/auth/login` with callback URL
- **Authenticated users without proper role** → Redirect to `/auth/unauthorized`

## Authentication Flow

### Scenario 1: User Not Logged In
1. User accesses `keuangan.localhost:3000`
2. Middleware rewrites to `/keuangan` (layout and pages)
3. RoleGuard detects user is NOT authenticated
4. User is redirected to `/auth/login?callbackUrl=/keuangan`
5. Middleware skips rewriting (auth route)
6. Login page displays at `keuangan.localhost:3000/auth/login`
7. After successful login, user is redirected back to `keuangan.localhost:3000`

### Scenario 2: User Logged In but Wrong Role
1. User (role: `member`) accesses `keuangan.localhost:3000`
2. RoleGuard detects user IS authenticated but LACKS required role
3. User is redirected to `/auth/unauthorized`
4. Middleware skips rewriting (auth route)
5. Unauthorized page displays at `keuangan.localhost:3000/auth/unauthorized`

### Scenario 3: User Logged In with Correct Role
1. User (role: `admin` or `sekretariat`) accesses `keuangan.localhost:3000`
2. RoleGuard detects user IS authenticated and HAS required role
3. Content is displayed normally

## Files Modified

1. ✅ `src/middleware.ts` - Skip auth routes from subdomain rewriting
2. ✅ `src/components/auth/RoleGuard.tsx` - Improved authentication/authorization logic

## Testing Steps

### Test 1: Unauthenticated Access
```bash
# 1. Sign out completely
# 2. Navigate to: http://keuangan.localhost:3000
# Expected: Redirected to login page at keuangan.localhost:3000/auth/login
# 3. Log in with Google
# Expected: Redirected back to keuangan.localhost:3000
```

### Test 2: Wrong Role Access
```bash
# 1. Log in as a user with 'member' role
# 2. Navigate to: http://keuangan.localhost:3000
# Expected: See "Access Denied" page at keuangan.localhost:3000/auth/unauthorized
```

### Test 3: Correct Role Access
```bash
# 1. Log in as a user with 'admin' or 'sekretariat' role
# 2. Navigate to: http://keuangan.localhost:3000
# Expected: See keuangan dashboard with full access
```

### Test 4: Read-Only Access
```bash
# 1. Log in as a user with 'pembina' role
# 2. Navigate to: http://keuangan.localhost:3000
# Expected: See keuangan dashboard with "Read-Only Access" badge
# Expected: "Input Transaksi" button should be hidden
```

## Role Summary for Keuangan Access

| Role | Can Access? | Access Level |
|------|------------|--------------|
| `admin` | ✅ Yes | Full (Read & Write) |
| `sekretariat` | ✅ Yes | Full (Read & Write) |
| `pembina` | ✅ Yes | Read-Only |
| `pengawas` | ✅ Yes | Read-Only |
| `pengurus` | ✅ Yes | Read-Only |
| `kepalabidang` | ✅ Yes | Read-Only |
| `kepalaunit` | ✅ Yes | Read-Only |
| `operatorunit` | ❌ No | No Access |
| `member` | ❌ No | No Access |
| `moderator` | ❌ No | No Access |
| `editor` | ❌ No | No Access |
| `viewer` | ❌ No | No Access |
| `guest` | ❌ No | No Access |

## How It Works

### RoleGuard Component
The `RoleGuard` wraps the keuangan layout and enforces access control:

```typescript
<RoleGuard
  allowedRoles={['admin', 'sekretariat', 'pembina', 'pengawas', 'pengurus', 'kepalabidang', 'kepalaunit']}
  fallbackUrl="/auth/unauthorized"
>
  {/* Keuangan content */}
</RoleGuard>
```

### Permission Hook
Use `useKeuanganPermissions` in components to check specific permissions:

```typescript
const { canWrite, hasReadOnlyAccess } = useKeuanganPermissions();

// Show button only to users with write access
{canWrite && <CreateButton />}

// Show badge for read-only users
{hasReadOnlyAccess && <ReadOnlyBadge />}
```

## Additional Notes

- Auth routes (`/auth/*`) work on ALL subdomains without rewriting
- After login, users are automatically redirected back to the page they were trying to access
- The system uses NextAuth with Google OAuth for authentication
- Session data includes user role for permission checking
- All permission checks happen on the client side via hooks (server-side checks should be added to API routes for security)
