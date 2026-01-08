# Local Subdomain Testing Guide

## The Problem

Browsers **do not support** cookie sharing for `.localhost` domain. This is a security restriction, which means:

- ❌ `localhost:3000` and `keuangan.localhost:3000` are treated as separate domains
- ❌ Cookies set on one won't be accessible on the other
- ✅ In **production**, `.muhajirinrewwin.or.id` works perfectly for all subdomains

## Solutions for Local Development

### Option 1: Use Custom Local Domain (Recommended)

Set up a custom local domain that mimics production behavior.

#### Step 1: Edit Your Hosts File

**Mac/Linux:**
```bash
sudo nano /etc/hosts
```

**Windows:**
```
Open: C:\Windows\System32\drivers\etc\hosts (as Administrator)
```

#### Step 2: Add These Lines

```
127.0.0.1 almuhajirin.local
127.0.0.1 keuangan.almuhajirin.local
127.0.0.1 masjid.almuhajirin.local
127.0.0.1 kbtk.almuhajirin.local
127.0.0.1 daycare.almuhajirin.local
127.0.0.1 pool.almuhajirin.local
127.0.0.1 lazmu.almuhajirin.local
127.0.0.1 wafmu.almuhajirin.local
127.0.0.1 ambulans.almuhajirin.local
127.0.0.1 poliklinik.almuhajirin.local
127.0.0.1 tpq.almuhajirin.local
127.0.0.1 kemuslimatan.almuhajirin.local
127.0.0.1 remas.almuhajirin.local
127.0.0.1 usaha.almuhajirin.local
```

#### Step 3: Update NextAuth Configuration

Edit `.env.local`:
```bash
NEXTAUTH_URL=http://almuhajirin.local:3000
```

Update `src/app/api/auth/[...nextauth]/options.ts`:
```typescript
cookies: {
  sessionToken: {
    options: {
      domain: process.env.NODE_ENV === 'production'
        ? '.muhajirinrewwin.or.id'
        : '.almuhajirin.local', // ✅ Now works locally!
    },
  },
  // ... same for callbackUrl
}
```

#### Step 4: Update Middleware

Edit `src/middleware.ts` to recognize the new domain:
```typescript
if (hostname.includes('localhost') || hostname.includes('almuhajirin.local')) {
  if (hostParts.length >= 2 && hostParts[0] !== 'localhost' && hostParts[0] !== 'almuhajirin') {
    subdomain = hostParts[0];
  }
}
```

#### Step 5: Test

```bash
npm run dev

# Then visit:
http://almuhajirin.local:3000
http://keuangan.almuhajirin.local:3000
http://masjid.almuhajirin.local:3000
```

Now cookies will work across all subdomains! 🎉

---

### Option 2: Accept Separate Logins (Current Setup)

With the current configuration:

- ✅ **Production**: Single sign-on works across all subdomains
- ⚠️ **Development**: You'll need to login separately on each subdomain

This is acceptable for development since:
- Most development happens on the main domain
- Cross-subdomain testing can be done in production/staging
- Simpler setup, no hosts file editing needed

**To test cross-subdomain auth**: Deploy to production or staging environment.

---

### Option 3: Use a Tunneling Service

Use services like:
- [ngrok](https://ngrok.com/) - Creates a public URL
- [localhost.run](http://localhost.run/) - SSH-based tunnel

**Example with ngrok:**
```bash
# Install ngrok
brew install ngrok  # Mac
# or download from ngrok.com

# Start your app
npm run dev

# In another terminal
ngrok http 3000

# You'll get URLs like:
# https://abc123.ngrok.io (main)
# Configure custom subdomain with ngrok pro
```

This gives you a real domain that supports subdomains.

---

## Recommended Approach

**For Daily Development:**
- Use Option 2 (current setup - separate logins)
- Quick and simple

**For Testing Cross-Subdomain Features:**
- Use Option 1 (custom local domain)
- Best for thorough testing
- One-time setup

**For Demo/Testing with Others:**
- Use Option 3 (ngrok)
- Share links with team/client

---

## Production Deployment

In production, everything works automatically:

✅ Login at `muhajirinrewwin.or.id`
✅ Access `keuangan.muhajirinrewwin.or.id` without re-login
✅ Access `masjid.muhajirinrewwin.or.id` without re-login
✅ All subdomains share the same session

The `.muhajirinrewwin.or.id` domain in the cookie configuration ensures this works perfectly!

---

## Troubleshooting

### Cookies Not Sharing After Setup

1. **Clear all cookies** for localhost/almuhajirin.local
2. **Restart your dev server**
3. **Check browser DevTools** → Application → Cookies
4. Verify the cookie has `domain: .almuhajirin.local`

### /etc/hosts Not Working

- **Mac/Linux**: Make sure you saved with `sudo`
- **Windows**: Make sure you saved as Administrator
- **All**: Try `ping almuhajirin.local` to verify DNS resolution

### Still Not Working

- Check NextAuth version compatibility
- Verify `NEXTAUTH_URL` in `.env.local`
- Check browser console for CORS errors
- Try a different browser (Chrome vs Firefox handle cookies differently)

---

**Note**: The configuration is already set for production to work perfectly. Choose Option 1 only if you need to test cross-subdomain authentication during development.
