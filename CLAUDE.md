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

This is a Next.js 15 application with a dual-layout architecture supporting both dashboard and marketing website views. The application uses the App Router with TypeScript.

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
- Dynamic routing with role-based access control

### Authentication System
- Hybrid authentication: Google OAuth + email/password
- Role-based access control (admin, moderator, editor, member, viewer, guest)
- Password reset functionality with email tokens
- Prisma adapter for session storage (PostgreSQL)
- JWT session strategy for improved performance
- Custom user roles with admin hardcoded for guntarion@gmail.com

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
- `src/components/` - Reusable components
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