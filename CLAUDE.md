# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run check` - Run both lint and type-check
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply new database migration
- `npx prisma generate` - Regenerate Prisma Client after schema changes

## Architecture Overview

This is a Next.js 15 application with a multi-subdomain architecture supporting:
- Main website (muhajirinrewwin.or.id)
- Dashboard for admin/management
- 12 unit-specific subdomains for organizational units

The application uses the App Router with TypeScript and middleware-based subdomain routing.

### Core Technologies
- **Frontend**: Next.js 15, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI components, shadcn/ui
- **Authentication**: NextAuth.js with Google OAuth and credentials provider
- **Database**: PostgreSQL with Prisma ORM (primary), MongoDB available for legacy operations
- **AI Integration**: Multiple AI providers (Anthropic, OpenAI, Google Gemini, Perplexity)
- **File Storage**: AWS S3/DigitalOcean Spaces integration

### Layout Structure
- `(DashboardLayout)` - Protected dashboard with sidebar navigation
- `(WebsiteLayout)` - Public marketing pages
- `units/` - Unit-specific pages accessible via subdomains
- Dynamic routing with role-based access control

### Multi-Subdomain Architecture

The application supports 12 organizational units, each accessible via dedicated subdomain:

| Unit | Subdomain | Path |
|------|-----------|------|
| Main Website | muhajirinrewwin.or.id | / |
| Usaha & Pengadaan | usaha.muhajirinrewwin.or.id | /units/usaha |
| Kolam Renang | pool.muhajirinrewwin.or.id | /units/pool |
| Ketakmiran Masjid | masjid.muhajirinrewwin.or.id | /units/masjid |
| Remaskidz | remas.muhajirinrewwin.or.id | /units/remas |
| Kemuslimatan | kemuslimatan.muhajirinrewwin.or.id | /units/kemuslimatan |
| Daycare | daycare.muhajirinrewwin.or.id | /units/daycare |
| KBTK | kbtk.muhajirinrewwin.or.id | /units/kbtk |
| TPQ | tpq.muhajirinrewwin.or.id | /units/tpq |
| LAZMU | lazmu.muhajirinrewwin.or.id | /units/lazmu |
| WAFMU | wafmu.muhajirinrewwin.or.id | /units/wafmu |
| Ambulans | ambulans.muhajirinrewwin.or.id | /units/ambulans |
| Poliklinik | poliklinik.muhajirinrewwin.or.id | /units/poliklinik |

**Routing Implementation:**
- Middleware (`src/middleware.ts`) detects subdomain and rewrites to appropriate unit path
- Works in both development (subdomain.localhost:3000) and production
- Each unit has its own layout and page structure in `src/app/units/[unit-name]/`

**Development Testing:**
- Use format: `http://subdomain.localhost:3000`
- Example: `http://masjid.localhost:3000`, `http://kbtk.localhost:3000`
- Or edit `/etc/hosts` to add custom subdomain aliases

**Deployment:**
- Add all subdomains in Vercel project settings
- Configure DNS records to point to Vercel
- Middleware automatically handles routing

### Authentication System
- Hybrid authentication: Google OAuth + email/password
- **Role-based access control** with organizational hierarchy:
  - **Leadership**: admin, pengurus, pengawas, pembina
  - **Management**: kepalabidang, kepalaunit, operatorunit, sekretariat
  - **General**: member, moderator, editor, viewer, guest
- Password reset functionality with email tokens
- Prisma adapter for session storage (PostgreSQL)
- JWT session strategy for improved performance
- Custom user roles with admin hardcoded for guntarion@gmail.com

### Keuangan Module Access Control (IMPORTANT)
The keuangan module at `keuangan.muhajirinrewwin.or.id` is protected with role-based access:

**Access Levels:**
- **Full Access (Read & Write)**: admin, sekretariat
- **Read-Only Access**: pembina, pengawas, pengurus, kepalabidang, kepalaunit
- **No Access**: All other roles (redirected to unauthorized page)

**Implementation:**
- Layout protected by `RoleGuard` component at `src/app/keuangan/layout.tsx`
- Use `useKeuanganPermissions()` hook to check permissions in components
- Auth routes (`/auth/*`) bypass middleware rewriting and work on all subdomains
- Unauthenticated users → redirected to login with callback URL
- Authenticated users without role → redirected to `/auth/unauthorized`

**Example Usage:**
```typescript
import { useKeuanganPermissions } from '@/hooks/useKeuanganPermissions';

function MyPage() {
  const { canWrite, hasReadOnlyAccess } = useKeuanganPermissions();

  return (
    <>
      {canWrite && <CreateButton />}
      {hasReadOnlyAccess && <ReadOnlyBadge />}
    </>
  );
}
```

See `KEUANGAN_PERMISSIONS.md` and `AUTH_FLOW_SUMMARY.md` for detailed documentation.

### Key Components
- **Sidebar Navigation**: Role-aware menu items in `Sidebaritems.ts`
- **RoleGuard**: Component for protecting routes by user role
- **AI Integration**: Separate API routes for different AI providers
- **File Upload**: Image and file upload with cloud storage support

### Database Schema (PostgreSQL/Prisma)
- **users** - User profiles, credentials, roles, with fields:
  - Basic: id, name, email, emailVerified, password, image
  - Profile: namaPanggilan, nomerHandphone, gender, tanggalLahir
  - Auth: role (enum), resetToken, resetTokenExpiry
  - Timestamps: createdAt, updatedAt
- **accounts** - OAuth provider data (NextAuth managed)
- **sessions** - Active user sessions (NextAuth managed)
- **verification_tokens** - Email verification tokens (NextAuth managed)

For legacy MongoDB operations, use `getMongoClient()` or `getCurrentUserMongo()` from `src/utils/database.ts`

### Environment Variables Required
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `DATABASE_URL` - PostgreSQL connection string (primary database)
- `MONGODB_URI` - MongoDB connection string (legacy operations)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_FROM` (for password reset)
- AI provider API keys (Anthropic, OpenAI, Gemini, Perplexity, etc.)
- Cloud storage credentials (DigitalOcean Spaces/AWS S3)

### File Organization
- `src/app/` - App Router pages and layouts
  - `(DashboardLayout)/` - Protected admin/management pages
  - `(WebsiteLayout)/` - Public marketing pages
  - `units/` - Unit-specific pages for subdomains (12 units)
  - `api/` - API routes
  - `auth/` - Authentication pages
- `src/components/` - Reusable components
- `src/middleware.ts` - Subdomain routing and request handling
- `src/utils/` - Utility functions and database connections
  - `prisma.ts` - Prisma Client singleton (PostgreSQL)
  - `database.ts` - Database utilities with dual-database support
  - `mongodb.ts` - MongoDB connection utilities (legacy)
- `src/types/` - TypeScript type definitions
- `src/hooks/` - Custom React hooks
- `src/models/` - Mongoose models (legacy, kept for reference)
- `prisma/` - Prisma schema and migrations
  - `schema.prisma` - Database schema definition
  - `migrations/` - Version-controlled database migrations
- `docs/` - Comprehensive project documentation
- `MIGRATION_SUMMARY.md` - Database migration documentation

### Working with Prisma (Database Operations)

**Default Approach - Use Prisma for all database operations:**

```typescript
import { prisma } from '@/utils/prisma';

// Find user by email
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Create user
const newUser = await prisma.user.create({
  data: { name, email, password, role: 'member' }
});

// Update user
const updated = await prisma.user.update({
  where: { id: userId },
  data: { name: 'New Name' }
});

// Query with relations
const userWithAccounts = await prisma.user.findUnique({
  where: { id: userId },
  include: { accounts: true, sessions: true }
});
```

**Schema Changes:**
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description_of_change`
3. Prisma Client will auto-regenerate

**Legacy MongoDB (only when specifically needed):**
```typescript
import { getMongoClient } from '@/utils/database';

const client = await getMongoClient();
const db = client.db();
const collection = db.collection('collection_name');
```

### Working with Subdomain Units

**Creating New Unit:**
1. Create folder in `src/app/units/[unit-name]/`
2. Add `layout.tsx` and `page.tsx` files
3. Update `SUBDOMAIN_ROUTES` in `src/middleware.ts`
4. Add subdomain to Vercel project settings for deployment

**Unit Structure Template:**
```typescript
// layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unit Name - Al Muhajirin',
  description: 'Description',
};

export default function UnitLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}

// page.tsx
export default function UnitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Content */}
    </div>
  );
}
```

**Testing Subdomains Locally:**
```bash
# Access via browser:
http://masjid.localhost:3000
http://kbtk.localhost:3000
http://pool.localhost:3000

# Or edit /etc/hosts (Mac/Linux):
127.0.0.1 masjid.localhost
127.0.0.1 kbtk.localhost
```

**Deployment Checklist:**
- [ ] Add all subdomains in Vercel project settings
- [ ] Configure DNS A/CNAME records
- [ ] Test each subdomain after deployment
- [ ] Verify SSL certificates for all subdomains

### Special Notes
- **Dual-Database Architecture**: PostgreSQL (Prisma) is the primary database; MongoDB available for legacy operations
  - Default: Use `prisma` from `@/utils/prisma` for all database operations
  - Legacy: Use `getMongoClient()` or `getCurrentUserMongo()` when MongoDB is specifically needed
- **Database Migrations**: Use Prisma migrations for schema changes (`npx prisma migrate dev`)
- **Type Safety**: Prisma provides full TypeScript support with auto-generated types
- Multiple AI providers integrated with unified API pattern
- Comprehensive documentation in `/docs` folder including authentication guides
- Role-based sidebar navigation with conditional rendering
- Image optimization configured for multiple domains
- Custom theme provider with dark mode support
- See `MIGRATION_SUMMARY.md` for complete database migration details