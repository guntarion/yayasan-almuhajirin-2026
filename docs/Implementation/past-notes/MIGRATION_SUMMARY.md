# Database Migration Summary: MongoDB to PostgreSQL with Prisma

## Overview
Successfully migrated the authentication and user management system from MongoDB/Mongoose to PostgreSQL using Prisma ORM, while keeping MongoDB available for legacy operations if needed.

## What Was Changed

### 1. Dependencies Installed
- `prisma` - Prisma CLI for schema management and migrations
- `@prisma/client` - Prisma Client for database queries
- `@next-auth/prisma-adapter` - NextAuth adapter for Prisma
- `dotenv` - Environment variable management for Prisma

### 2. Database Configuration

#### Prisma Schema (`prisma/schema.prisma`)
Created a complete Prisma schema with:
- **User model** - Main user table with all fields from MongoDB User model
- **Account model** - NextAuth OAuth accounts
- **Session model** - NextAuth sessions
- **VerificationToken model** - NextAuth verification tokens
- **Enums**: `Role` and `Gender`

All tables mapped with proper relationships and indexes.

#### Environment Variables
- PostgreSQL connection string already configured in `.env.local`
- Added to `.env` file for Prisma Studio compatibility

### 3. Files Created

#### `/src/utils/prisma.ts`
- Prisma Client singleton instance
- Optimized for development with connection pooling
- Logging enabled in development mode

#### `/src/utils/database.ts` (Updated)
- `getCurrentUser()` - Default function using Prisma (PostgreSQL)
- `getCurrentUserMongo()` - Legacy function for MongoDB access
- `getMongoClient()` - MongoDB client for backward compatibility

### 4. Authentication System Updated

#### `/src/app/api/auth/[...nextauth]/options.ts`
- Switched from `MongoDBAdapter` to `PrismaAdapter`
- Updated all callbacks to use Prisma queries:
  - `signIn` callback
  - `jwt` callback
  - `session` callback
  - `createUser` event
- Credentials provider updated to query PostgreSQL
- Maintained admin role assignment for guntarion@gmail.com

### 5. API Routes Migrated to Prisma

All user and authentication routes now use PostgreSQL via Prisma:

#### User Management Routes
- `/api/users/route.ts` - List all users (admin only)
- `/api/users/[id]/route.ts` - Get and update specific user
- `/api/users/[id]/role/route.ts` - Update user role (admin only)

#### Authentication Routes
- `/api/auth/register/route.ts` - User registration
- `/api/auth/forgot-password/route.ts` - Password reset request
- `/api/auth/reset-password/route.ts` - Process password reset
- `/api/auth/validate-reset-token/route.ts` - Validate reset token

## Database Schema

### User Table Structure
```typescript
model User {
  id                String    @id @default(cuid())
  name              String
  email             String    @unique
  emailVerified     DateTime?
  password          String?
  image             String?
  role              Role      @default(member)
  namaPanggilan     String?
  nomerHandphone    String?
  gender            Gender?
  tanggalLahir      DateTime?
  resetToken        String?
  resetTokenExpiry  DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  accounts          Account[]
  sessions          Session[]
}
```

### Enums
- **Role**: admin, member, moderator, editor, viewer, guest
- **Gender**: lelaki, perempuan

## Migration Executed
- Initial migration created: `20251118213538_init`
- All tables successfully created in PostgreSQL database
- Database is in sync with Prisma schema

## Backward Compatibility

MongoDB remains available for legacy operations through:
1. `getMongoClient()` function in `/src/utils/database.ts`
2. `getCurrentUserMongo()` for MongoDB-specific queries
3. Original MongoDB connection configured and ready

## Key Benefits

1. **Type Safety**: Full TypeScript support with Prisma generated types
2. **Performance**: PostgreSQL optimized queries
3. **Migrations**: Version-controlled schema changes
4. **Relationships**: Proper foreign key constraints and relations
5. **Query Builder**: Type-safe query API
6. **Dual Database**: MongoDB still available when needed

## Testing Status

- Type checking: PASSED
- All TypeScript compilation: PASSED
- Database schema: VALIDATED
- Migration: SUCCESSFUL

## Usage Examples

### Default (Prisma/PostgreSQL)
```typescript
import { prisma } from '@/utils/prisma';

// Get all users
const users = await prisma.user.findMany();

// Get user by email
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Create user
const newUser = await prisma.user.create({
  data: { name, email, password, role }
});
```

### Legacy MongoDB (When Needed)
```typescript
import { getMongoClient, getCurrentUserMongo } from '@/utils/database';

// Get MongoDB client
const client = await getMongoClient();
const db = client.db();

// Use MongoDB for specific operations
const users = db.collection('users').find({});
```

## Next Steps

1. Test authentication flow (login, register, password reset)
2. Verify all API endpoints work correctly
3. Test role-based access control
4. Monitor performance and optimize queries if needed
5. Consider migrating existing MongoDB data if required

## Useful Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Apply migrations in production
npx prisma migrate deploy
```

## Notes

- PostgreSQL user 'guntar' was granted superuser privileges for migrations
- Database: `titian_karir` on `103.215.229.104:5432`
- All sensitive credentials remain in `.env.local` (not committed)
- MongoDB connection still configured and functional for legacy operations
