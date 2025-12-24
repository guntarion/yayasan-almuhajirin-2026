# Troubleshooting Guide: Next.js 15 Dynamic Route Parameters

## Issue: Next.js 15 Dynamic Route Parameters Type Error

When upgrading to Next.js 15 or working with dynamic routes, you might encounter the following error during build:

```
Failed to compile.
src/app/(DashboardLayout)/tools/studi-literatur/[id]/page.tsx
Type error: Type 'PageProps' does not satisfy the constraint 'import("/Users/guntar/Codes/PROJECTS/INOVASI/Voltaic/.next/types/app/(DashboardLayout)/tools/studi-literatur/[id]/page").PageProps'.
  Types of property 'params' are incompatible.
    Type '{ id: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
```

## What's Happening?

In Next.js 15, there was a significant architectural change in how route parameters are handled:

1. **Next.js < 15**: Route parameters (`params`) were simple objects that could be directly accessed.
2. **Next.js >= 15**: Route parameters are now passed as Promises that must be properly awaited or resolved.

This change is part of Next.js's move toward a more async-first architecture, which improves rendering performance but requires code adjustments.

## Solution

To fix this issue, you need to modify your dynamic route page components to properly handle `params` as a Promise. Here's how:

### 1. Use React's `use` Hook (Recommended for Client Components)

```typescript
// app/(DashboardLayout)/tools/studi-literatur/[id]/page.tsx
import { use } from 'react';
import ClientPage from './ClientPage';

export default function Page(props: any) {
  // Get params from props
  const { params } = props;

  // In Next.js 15, params is a Promise, so we need to use the 'use' hook
  const resolvedParams = use(params);

  // Extract the ID from the resolved params
  const { id } = resolvedParams;

  // Render the client component with the extracted ID
  return <ClientPage id={id} />;
}
```

The `use` hook is React's way of unwrapping Promises in a way that's compatible with the React component lifecycle.

### 2. Alternative: Using Server Components with `async/await`

If you're using a Server Component, you can utilize `async/await`:

```typescript
// app/(DashboardLayout)/tools/studi-literatur/[id]/page.tsx
import ClientPage from './ClientPage';

export default async function Page(props: any) {
  // Get params from props
  const { params } = props;

  // In Next.js 15, params is a Promise, so we can await it
  const resolvedParams = await params;

  // Extract the ID from the resolved params
  const { id } = resolvedParams;

  // Render the client component with the extracted ID
  return <ClientPage id={id} />;
}
```

## Common Patterns for Dynamic Routes in Next.js 15

### Pattern 1: Server Component → Client Component

This pattern is useful when you need to fetch data on the server and pass it to a client component:

```typescript
// Server Component (page.tsx)
export default async function Page(props: any) {
  const { params } = props;
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // You can perform server-side data fetching here
  const data = await fetchDataOnServer(id);

  return <ClientComponent id={id} initialData={data} />;
}
```

### Pattern 2: Client Component with `use` Hook

This pattern is useful when you need client-side interactivity and still want to access route parameters:

```typescript
// Client Component (page.tsx)
'use client';

import { use } from 'react';

export default function Page(props: any) {
  const { params } = props;
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // Client-side state and effects
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data on the client side
    fetchData(id).then(setData);
  }, [id]);

  return <div>{/* Your UI */}</div>;
}
```

## Tips for Troubleshooting

1. **Check Next.js Version**: Confirm which version of Next.js you're using with `npm list next` or by checking your package.json.

2. **TypeScript Interfaces**: Make sure your TypeScript interfaces align with the new Promise-based params:

   ```typescript
   // Avoid this in Next.js 15:
   interface PageProps {
     params: { id: string };
   }

   // Use more flexible typing for now:
   export default function Page(props: any) {
     // ...
   }
   ```

3. **Avoid Direct Access**: Never directly access properties from `params` without using `use()` or `await`:

   ```typescript
   // Incorrect in Next.js 15:
   const { id } = params;

   // Correct in Next.js 15:
   const { id } = use(params);
   // or
   const { id } = await params;
   ```

4. **Client Components**: Remember that using `use` in client components must be at the top level, not inside hooks or conditional blocks.

## Final Note

This architectural change in Next.js 15 improves overall rendering performance but requires adjustments to existing code. By properly handling params as Promises, your application will fully leverage the benefits of Next.js's new async architecture.
