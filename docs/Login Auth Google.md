I've pasted several files related with auth with google from other project. You can check the git for the latest files addition and modification. I'm not sure if they've worked correctly, I might've missed something. Please check.

Here's how Google authentication works in the project that I've copied the files from:

1. **Configuration Setup** (`src/app/api/auth/[...nextauth]/options.ts`):
````typescript path=src/app/api/auth/[...nextauth]/options.ts mode=EXCERPT
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...other providers
  ],
  adapter: MongoDBAdapter(clientPromise),
````

2. **Client-Side Integration** (`src/hooks/useAuth.ts`):
````typescript path=src/hooks/useAuth.ts mode=EXCERPT
const loginWithGoogle = (callbackUrl = '/') => {
  signIn('google', { callbackUrl });
};
````

3. **UI Implementation** (`src/app/auth/authforms/AuthLogin.tsx`):
````typescript path=src/app/auth/authforms/AuthLogin.tsx mode=EXCERPT
<Button
  onClick={() => loginWithGoogle()}
  className='w-full mt-4 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 flex items-center justify-center'
  type='button'
>
  <FcGoogle className='mr-2 text-xl' />
  Sign in with Google
</Button>
````

The flow works as follows:

1. When a user clicks the "Sign in with Google" button, `loginWithGoogle()` is called
2. This triggers NextAuth's `signIn()` function with the 'google' provider
3. User is redirected to Google's authentication page
4. After successful authentication:
   - Google returns user data to your application
   - NextAuth creates/updates the user in MongoDB using the MongoDB adapter
   - The `signIn` callback in authOptions assigns a role:
   ```typescript
   if (user.email === 'guntarion@gmail.com') {
     await usersCollection.updateOne({ email: user.email }, { $set: { role: 'admin' } });
   } else {
     await usersCollection.updateOne({ email: user.email }, { $set: { role: 'member' } });
   }
   ```
5. The user is redirected to the specified callback URL (defaults to '/')

The session is then managed by NextAuth and can be accessed throughout the application using the `useAuth` hook, which provides authentication state and user information.

