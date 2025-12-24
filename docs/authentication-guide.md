# Authentication System Guide

This guide provides a comprehensive overview of the authentication system implemented in this Next.js project, which supports both Google OAuth and email/password authentication with MongoDB storage.

## Table of Contents

1. [Overview](#overview)
2. [Environment Variables](#environment-variables)
3. [Database Structure](#database-structure)
4. [NextAuth Configuration](#nextauth-configuration)
5. [Authentication Flows](#authentication-flows)
   - [Google Authentication](#google-authentication)
   - [Email/Password Authentication](#emailpassword-authentication)
   - [Password Reset Flow](#password-reset-flow)
6. [Role-Based Access Control](#role-based-access-control)
7. [Client-Side Components](#client-side-components)
8. [Implementation Guide](#implementation-guide)

## Overview

The authentication system uses NextAuth.js to handle authentication with both Google OAuth and traditional email/password credentials. User data is stored in MongoDB with two collections:

- `users`: Stores user profile information, credentials, and roles
- `accounts`: Stores OAuth provider account information (managed by NextAuth)

The system supports:

- Login with Google
- Registration and login with email/password
- Password reset via email
- Role-based access control

## Environment Variables

The following environment variables are required:

```
NEXTAUTH_URL=http://localhost:3000 # Your application URL
NEXTAUTH_SECRET=your-secret-key # Secret for JWT encryption
GOOGLE_CLIENT_ID=your-google-client-id # From Google Cloud Console
GOOGLE_CLIENT_SECRET=your-google-client-secret # From Google Cloud Console
MONGODB_URI=mongodb+srv://... # MongoDB connection string
EMAIL_USER=your-email@gmail.com # For sending password reset emails
EMAIL_PASSWORD=your-email-password # App password for Gmail
EMAIL_FROM=your-email@gmail.com # Sender email address
```

## Database Structure

### Users Collection

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

### Accounts Collection (Managed by NextAuth)

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

## NextAuth Configuration

The NextAuth configuration is defined in `src/app/api/auth/[...nextauth]/options.ts` and includes:

1. **Providers**:

   - Google OAuth provider
   - Credentials provider for email/password

2. **Callbacks**:

   - `signIn`: Ensures users have a role assigned
   - `jwt`: Adds role and user ID to the JWT token
   - `session`: Adds role and user ID to the session

3. **MongoDB Adapter**: Connects NextAuth to MongoDB for storing sessions and accounts

4. **Custom Pages**: Defines custom pages for sign-in and error handling

## Authentication Flows

### Google Authentication

1. User clicks "Sign in with Google" button
2. NextAuth redirects to Google OAuth consent screen
3. User authorizes the application
4. Google redirects back to the application with an authorization code
5. NextAuth exchanges the code for access and refresh tokens
6. NextAuth creates or updates the user in the database
7. User is redirected to the callback URL (usually the dashboard)

### Email/Password Authentication

#### Registration

1. User fills out the registration form with name, email, and password
2. Client-side validation ensures all fields are valid
3. Form data is submitted to `/api/auth/register` endpoint
4. Server validates the input and checks if the email already exists
5. Password is hashed using bcrypt
6. New user is created in the database with a default role
7. User is redirected to the login page

#### Login

1. User enters email and password in the login form
2. Form data is submitted to NextAuth's credentials provider
3. NextAuth validates the credentials against the database
4. If valid, a session is created and the user is redirected to the dashboard
5. If invalid, an error message is displayed

### Password Reset Flow

1. **Request Reset**:

   - User enters email on the forgot password page
   - Request is sent to `/api/auth/forgot-password` endpoint
   - Server generates a reset token and stores it with the user
   - Reset link is sent to the user's email

2. **Token Validation**:

   - User clicks the reset link in the email
   - Client validates the token via `/api/auth/validate-reset-token` endpoint
   - If valid, the reset password form is displayed
   - If invalid or expired, an error message is shown

3. **Password Reset**:
   - User enters a new password and confirms it
   - Request is sent to `/api/auth/reset-password` endpoint with token and new password
   - Server validates the token, hashes the new password, and updates the user
   - Reset token is cleared from the database
   - User is redirected to the login page

## Role-Based Access Control

The system implements role-based access control through:

1. **Role Assignment**:

   - Default role 'member' is assigned to new users
   - Special handling for admin email (hardcoded in this example)

2. **Role Checking**:

   - `useAuth` hook provides a `hasRole` function to check user roles
   - `RoleGuard` component protects routes based on required roles

3. **JWT and Session**:
   - User role is included in the JWT token and session
   - Extended types in `next-auth.d.ts` ensure proper typing

## Client-Side Components

### Authentication Forms

1. **Login Form** (`AuthLogin.tsx`):

   - Email/password login
   - Google login button
   - "Remember me" option
   - Forgot password link

2. **Registration Form** (`AuthRegister.tsx`):

   - Name, email, password fields
   - Client-side validation
   - Google registration button

3. **Forgot Password Form** (`forgot-password/page.tsx`):

   - Email input
   - Success/error handling

4. **Reset Password Form** (`reset-password/[token]/page.tsx`):
   - Token validation
   - New password and confirmation
   - Success/error handling

### Authentication Hooks and Providers

1. **useAuth Hook** (`useAuth.ts`):

   - Provides authentication state and methods
   - Role checking functionality
   - Login/logout methods

2. **SessionProvider** (`SessionProvider.tsx`):

   - Wraps the application with NextAuth session context

3. **RoleGuard** (`RoleGuard.tsx`):
   - Protects routes based on user roles
   - Redirects unauthorized users

## Implementation Guide

### 1. Set Up Environment Variables

Create a `.env.local` file with the required environment variables:

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

### 2. Set Up MongoDB

1. Create a MongoDB database (Atlas or local)
2. Create collections: `users` and `accounts` (NextAuth will handle this automatically)
3. Configure the connection string in your environment variables

### 3. Configure Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Configure the OAuth consent screen
4. Create OAuth client ID credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (and your production URL)
6. Copy the client ID and secret to your environment variables

### 4. Implement NextAuth

1. Install required packages:

   ```bash
   npm install next-auth @auth/mongodb-adapter mongodb bcryptjs nodemailer
   ```

2. Create the NextAuth API route and configuration files:

   - `src/app/api/auth/[...nextauth]/route.ts`
   - `src/app/api/auth/[...nextauth]/options.ts`

3. Set up the MongoDB adapter and providers

### 5. Create Authentication API Routes

1. Registration endpoint:

   - `src/app/api/auth/register/route.ts`

2. Password reset endpoints:
   - `src/app/api/auth/forgot-password/route.ts`
   - `src/app/api/auth/reset-password/route.ts`
   - `src/app/api/auth/validate-reset-token/route.ts`

### 6. Create Authentication UI Components

1. Login page and form
2. Registration page and form
3. Forgot password page
4. Reset password page

### 7. Implement Client-Side Authentication

1. Create the `useAuth` hook
2. Set up the SessionProvider
3. Create the RoleGuard component

### 8. Protect Routes

Use the RoleGuard component to protect routes based on user roles:

```tsx
<RoleGuard allowedRoles={['admin', 'editor']}>
  <AdminDashboard />
</RoleGuard>
```

### 9. Test Authentication Flows

1. Test Google login
2. Test email/password registration and login
3. Test password reset flow
4. Test role-based access control

## Conclusion

This authentication system provides a secure and flexible way to handle user authentication in a Next.js application. It supports multiple authentication methods and role-based access control, making it suitable for a wide range of applications.

The combination of NextAuth.js and MongoDB provides a robust foundation that can be extended with additional features as needed, such as email verification, multi-factor authentication, or additional OAuth providers.
