I have Next.js app with FastAPI as backend. Help me implement Google Auth: sign in/login and register functionality, with forget password feature using email. There roles are: admin, pengelola, supervisor, juri, inovator, ideator, member, viewer, and guest. User guntarion@gmail.com is appointed as admin when signing in. We should have a page to change role.





Create a secure authentication system for a Next.js application with FastAPI backend implementing the following features:

1. Google OAuth2 Integration:
- Implement Google Sign-in/Login functionality
- Enable user registration through Google
- Store essential user data: email, name, profile picture, role
- Automatically assign admin role to guntarion@gmail.com upon first sign-in

2. Password Management:
- Implement "Forgot Password" functionality using email verification
- Send password reset links with secure tokens
- Enable password reset with token validation
- Set token expiration time to 1 hour

3. Role Management System:
- Implement the following role hierarchy (highest to lowest):
  * admin
  * pengelola
  * supervisor
  * juri
  * inovator
  * ideator
  * member
  * viewer
  * guest (default role for new users)
- Create a protected admin dashboard for role management
- Enable role modification only for admin users
- Implement role-based access control (RBAC) for all routes
- Log all authentication attempts and role changes

4. Frontend Requirements:
- Create responsive authentication pages
- Create beautiful login and register page using tailwind
- Add loading states for all authentication actions
- Implement proper error handling and user feedback
- Add client-side validation
- Create a role management interface for admins



I Attached document of "Next.js Google Auth & Email Authentication Implementation Guide" This document provides a detailed explanation of how authentication is implemented in full Next.js project (without FastAPI), focusing on the specific files and their relationships. It covers both Google OAuth and email/password authentication with MongoDB.

Use this as reference to build our own auth implementation using NextJS and FastAPI. In other word: we only use this as reference of how auth system is usually implemented by user. User has never implemented it on NextJS + FastAPI. Please provide your best suggestion for this matter. Consider the f

## File Structure

The authentication system on REFERENCE PROJECT is organized across several directories:

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   ├── route.ts         # NextAuth API route handler
│   │       │   └── options.ts       # NextAuth configuration
│   │       ├── register/
│   │       │   └── route.ts         # Email registration API
│   │       ├── forgot-password/
│   │       │   └── route.ts         # Password reset request API
│   │       ├── reset-password/
│   │       │   └── route.ts         # Password reset API
│   │       └── validate-reset-token/
│   │           └── route.ts         # Token validation API
│   └── auth/
│       ├── authforms/
│       │   ├── AuthLogin.tsx        # Login form component
│       │   └── AuthRegister.tsx     # Registration form component
│       ├── login/
│       │   └── page.tsx             # Login page
│       ├── register/
│       │   └── page.tsx             # Registration page
│       ├── forgot-password/
│       │   └── page.tsx             # Forgot password page
│       └── reset-password/
│           └── [token]/
│               └── page.tsx         # Reset password page
├── Components/
│   └── auth/
│       └── RoleGuard.tsx            # Role-based access control
├── hooks/
│   └── useAuth.ts                   # Authentication hook
├── providers/
│   └── SessionProvider.tsx          # NextAuth session provider
├── types/
│   └── next-auth.d.ts               # NextAuth type extensions
└── utils/
    ├── mongodb.ts                   # MongoDB connection utilities
    └── email.ts                     # Email sending utilities
```

As for our own project, the one you are tasked to working on, the filestructure is the following:

```
.
├── LICENSE
├── README.md
├── api
│   ├── __pycache__
│   │   └── index.cpython-312.pyc
│   └── index.py
├── app
│   ├── api
│   │   └── helloNextJs
│   │       └── route.ts
│   ├── components
│   │   ├── Breadcrumb
│   │   │   └── Breadcrumb.tsx
│   │   ├── Header
│   │   │   └── Header.tsx
│   │   ├── Layouts
│   │   │   ├── BreadcrumbLayout.tsx
│   │   │   ├── FullLayout.tsx
│   │   │   ├── SimpleLayout.tsx
│   │   │   └── index.ts
│   │   └── Sidebar
│   │       ├── MobileSidebar.tsx
│   │       └── Sidebar.tsx
│   ├── config
│   │   └── sidebarItems.ts
│   ├── contexts
│   │   └── LayoutContext.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── innovation
│   │   ├── analytics
│   │   │   └── page.tsx
│   │   └── ideas
│   │       └── page.tsx
│   ├── knowledge
│   │   ├── base
│   │   │   └── page.tsx
│   │   └── sharing
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── folder_structure.txt
├── next-env.d.ts
├── next.config.js
├── nextjs-fastapi-integration.md
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── next.svg
│   └── vercel.svg
├── requirements.txt
├── tailwind.config.js
└── tsconfig.json

20 directories, 35 files

```






# Next.js Google Auth & Email Authentication Implementation Guide


## Core Authentication Files

### 1. NextAuth Configuration

**File: `src/app/api/auth/[...nextauth]/options.ts`**

This file configures NextAuth.js with:

- **Providers**:

  - Google OAuth provider
  - Credentials provider for email/password login

- **MongoDB Adapter**: Connects NextAuth to MongoDB for session and account storage

- **Callbacks**:

  - `signIn`: Ensures users have a role assigned
  - `jwt`: Adds role and user ID to the JWT token
  - `session`: Adds role and user ID to the session

- **Custom Pages**: Defines custom pages for sign-in and error handling

- **Events**: Handles user creation events to assign roles

```typescript
// Key configuration
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      // Email/password authentication
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // JWT and session callbacks
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
};
```

### 2. NextAuth API Route

**File: `src/app/api/auth/[...nextauth]/route.ts`**

This file creates the NextAuth API route handler using the configuration from `options.ts`:

```typescript
import NextAuth from 'next-auth';
import { authOptions } from './options';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

### 3. MongoDB Connection

**File: `src/utils/mongodb.ts`**

This utility file provides functions to connect to MongoDB:

- `connectToMongoose()`: Connects using Mongoose (for schema-based operations)
- `connectToDatabase()`: Connects using the MongoDB native client (for direct operations)

Both functions implement connection pooling and caching to prevent multiple connections during development hot reloads.

### 4. Email Utilities

**File: `src/utils/email.ts`**

This file provides email functionality for password reset:

- `sendEmail()`: Sends emails using nodemailer
- `generatePasswordResetEmail()`: Creates HTML email content for password reset

## Authentication Flows

### 1. Google Authentication

**Key Files:**

- `src/app/api/auth/[...nextauth]/options.ts` (Google provider configuration)
- `src/app/auth/authforms/AuthLogin.tsx` (Google login button)
- `src/hooks/useAuth.ts` (loginWithGoogle function)

**Flow:**

1. User clicks "Sign in with Google" button in `AuthLogin.tsx`
2. The `loginWithGoogle()` function from `useAuth.ts` calls `signIn('google')`
3. NextAuth redirects to Google OAuth consent screen
4. After authorization, Google redirects back to the application
5. NextAuth creates or updates the user in the database via the MongoDB adapter
6. User is redirected to the dashboard

### 2. Email/Password Registration

**Key Files:**

- `src/app/auth/authforms/AuthRegister.tsx` (Registration form)
- `src/app/api/auth/register/route.ts` (Registration API)

**Flow:**

1. User fills out the registration form in `AuthRegister.tsx`
2. Client-side validation ensures all fields are valid
3. Form data is submitted to `/api/auth/register` endpoint
4. Server validates the input and checks if the email already exists
5. Password is hashed using bcrypt
6. New user is created in the database with a default role
7. User is redirected to the login page

**Implementation Details:**

```typescript
// Registration API (route.ts)
export async function POST(request: NextRequest) {
  // Extract and validate user data
  const { name, email, password } = await request.json();

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in database
  await usersCollection.insertOne({
    name,
    email,
    password: hashedPassword,
    role: email === 'admin@example.com' ? 'admin' : 'member',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Return success response
}
```

### 3. Email/Password Login

**Key Files:**

- `src/app/auth/authforms/AuthLogin.tsx` (Login form)
- `src/app/api/auth/[...nextauth]/options.ts` (Credentials provider)

**Flow:**

1. User enters email and password in `AuthLogin.tsx`
2. Form data is submitted to NextAuth's credentials provider
3. The `authorize` function in the credentials provider:
   - Connects to MongoDB
   - Finds the user by email
   - Compares the password hash using bcrypt
   - Returns the user object if valid
4. NextAuth creates a session and JWT
5. User is redirected to the dashboard

**Implementation Details:**

```typescript
// Credentials provider in options.ts
CredentialsProvider({
  async authorize(credentials) {
    // Find user in database
    const user = await usersCollection.findOne({ email: credentials.email });

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

    if (isPasswordValid) {
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || 'member',
      };
    }

    return null;
  },
});
```

### 4. Password Reset Flow

**Key Files:**

- `src/app/auth/forgot-password/page.tsx` (Forgot password page)
- `src/app/api/auth/forgot-password/route.ts` (Password reset request API)
- `src/app/auth/reset-password/[token]/page.tsx` (Reset password page)
- `src/app/api/auth/reset-password/route.ts` (Password reset API)
- `src/app/api/auth/validate-reset-token/route.ts` (Token validation API)
- `src/utils/email.ts` (Email utilities)

**Flow:**

1. **Request Reset:**

   - User enters email on the forgot password page
   - Request is sent to `/api/auth/forgot-password` endpoint
   - Server generates a reset token and stores it with the user
   - Reset link is sent to the user's email

2. **Token Validation:**

   - User clicks the reset link in the email
   - Reset password page loads and validates the token
   - If valid, the reset password form is displayed
   - If invalid or expired, an error message is shown

3. **Password Reset:**
   - User enters a new password and confirms it
   - Request is sent to `/api/auth/reset-password` endpoint
   - Server validates the token, hashes the new password, and updates the user
   - Reset token is cleared from the database
   - User is redirected to the login page

## Client-Side Authentication

### 1. useAuth Hook

**File: `src/hooks/useAuth.ts`**

This custom hook provides authentication state and methods:

```typescript
export function useAuth() {
  const { data: session, status } = useSession();

  // Authentication state
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

  // Role checking
  const hasRole = (requiredRole: string | string[]) => {
    // Check if user has required role
  };

  // Authentication methods
  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  const loginWithGoogle = (callbackUrl = '/') => {
    signIn('google', { callbackUrl });
  };

  return {
    session,
    status,
    isAuthenticated,
    isLoading,
    user,
    hasRole,
    loginWithGoogle,
    logout,
  };
}
```

### 2. SessionProvider

**File: `src/providers/SessionProvider.tsx`**

This component wraps the application with NextAuth's session context:

```typescript
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

### 3. RoleGuard

**File: `src/Components/auth/RoleGuard.tsx`**

This component protects routes based on user roles:

```typescript
export default function RoleGuard({ children, allowedRoles, fallbackUrl = '/auth/unauthorized' }: RoleGuardProps) {
  const { hasRole, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !hasRole(allowedRoles)) {
        router.push(fallbackUrl);
      }
    }
  }, [isAuthenticated, hasRole, isLoading, router, allowedRoles, fallbackUrl]);

  // Render content if user has required role
  if (isAuthenticated && hasRole(allowedRoles)) {
    return <>{children}</>;
  }

  return null;
}
```

## Database Schema

### Users Collection

The `users` collection stores user profile information and credentials:

```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string; // Hashed password (only for email/password users)
  image?: string;
  role: string; // 'admin', 'member', etc.
  createdAt: Date;
  updatedAt: Date;
  resetToken?: string; // For password reset
  resetTokenExpiry?: Date; // For password reset
}
```

### Accounts Collection

The `accounts` collection stores OAuth provider information (managed by NextAuth):

```typescript
interface Account {
  _id: ObjectId;
  userId: ObjectId;
  type: string; // 'oauth', 'email', etc.
  provider: string; // 'google', 'credentials', etc.
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}
```

## Security Considerations

1. **Password Hashing**: Passwords are hashed using bcrypt with a salt factor of 10.

2. **JWT Security**: JWTs are signed using the NEXTAUTH_SECRET environment variable.

3. **Password Reset Tokens**: Reset tokens are:

   - Generated using crypto.randomBytes(32)
   - Stored in the database with an expiry time (1 hour)
   - Validated before allowing password reset

4. **Email Security**: Password reset emails are sent using SMTP with authentication.

5. **Role-Based Access Control**: Routes are protected based on user roles.

## Implementation Steps

To implement this authentication system in a new project:

1. **Install Dependencies**:

   ```bash
   npm install next-auth @auth/mongodb-adapter mongodb bcryptjs nodemailer
   ```

2. **Set Up Environment Variables**:

   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   MONGODB_URI=mongodb+srv://...
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-email-password
   EMAIL_FROM=your-email@gmail.com
   ```

3. **Create NextAuth Configuration**:

   - Create the NextAuth API route and options files
   - Configure providers, callbacks, and the MongoDB adapter

4. **Create Authentication API Routes**:

   - Registration endpoint
   - Password reset endpoints

5. **Create Authentication UI Components**:

   - Login form
   - Registration form
   - Forgot password form
   - Reset password form

6. **Set Up Client-Side Authentication**:

   - Create the useAuth hook
   - Set up the SessionProvider
   - Create the RoleGuard component

7. **Protect Routes**:
   - Use the RoleGuard component to protect routes based on user roles

## Conclusion

This authentication system provides a secure and flexible way to handle user authentication in a Next.js application. It supports both Google OAuth and email/password authentication, with a complete password reset flow and role-based access control.

The implementation is modular and follows best practices for security and user experience. It can be extended with additional features such as email verification, multi-factor authentication, or additional OAuth providers.
