# Subdomain Setup Guide for Vercel Deployment

## Current Issue
Main domain (muhajirinrewwin.or.id) works, but subdomains show ERR_CONNECTION_CLOSED.

## Root Cause
Subdomains are not configured in Vercel and/or DNS records are missing.

## Solution Steps

### Step 1: Add Subdomains to Vercel

Go to your Vercel project: https://vercel.com/guntars-projects/muhajirinrewwin/settings/domains

Click "Add Domain" and add each of these subdomains (one at a time):

1. ✅ muhajirinrewwin.or.id (already added)
2. ✅ www.muhajirinrewwin.or.id (already added)
3. ⬜ masjid.muhajirinrewwin.or.id
4. ⬜ kbtk.muhajirinrewwin.or.id
5. ⬜ daycare.muhajirinrewwin.or.id
6. ⬜ lazmu.muhajirinrewwin.or.id
7. ⬜ pool.muhajirinrewwin.or.id
8. ⬜ usaha.muhajirinrewwin.or.id
9. ⬜ remas.muhajirinrewwin.or.id
10. ⬜ kemuslimatan.muhajirinrewwin.or.id
11. ⬜ tpq.muhajirinrewwin.or.id
12. ⬜ wafmu.muhajirinrewwin.or.id
13. ⬜ ambulans.muhajirinrewwin.or.id
14. ⬜ poliklinik.muhajirinrewwin.or.id
15. ⬜ keuangan.muhajirinrewwin.or.id

**For each subdomain:**
- Click "Add Domain"
- Enter the subdomain (e.g., masjid.muhajirinrewwin.or.id)
- Select "Connect to an environment" → "Production"
- Click "Save"
- Vercel will show DNS instructions

### Step 2: Configure DNS at Your Domain Provider

Log into your domain provider's DNS management panel.

**Option A: Wildcard DNS (Recommended)**

Add ONE record that covers all subdomains:

```
Type: CNAME
Name: *
Value: cname.vercel-dns.com
TTL: 3600 (or default)
```

**Option B: Individual DNS Records**

If your provider doesn't support wildcards, add each subdomain individually:

```
Type: CNAME
Name: masjid
Value: cname.vercel-dns.com
TTL: 3600

Type: CNAME
Name: kbtk
Value: cname.vercel-dns.com
TTL: 3600

Type: CNAME
Name: daycare
Value: cname.vercel-dns.com
TTL: 3600

... (repeat for all subdomains)
```

### Step 3: Verify Configuration

After adding DNS records, wait 5-30 minutes for propagation, then:

1. **Check DNS propagation:**
   ```bash
   nslookup masjid.muhajirinrewwin.or.id
   nslookup kbtk.muhajirinrewwin.or.id
   ```

   You should see Vercel's IP addresses (e.g., 76.76.21.21)

2. **Check in Vercel:**
   - Go to Settings → Domains
   - Each subdomain should show "Valid Configuration" with a green checkmark

3. **Test in browser:**
   - https://masjid.muhajirinrewwin.or.id
   - https://kbtk.muhajirinrewwin.or.id
   - https://daycare.muhajirinrewwin.or.id
   - etc.

### Step 4: Verify Middleware Routing

Once DNS is working, test that the middleware correctly routes to unit pages:

- https://masjid.muhajirinrewwin.or.id → should show Masjid content
- https://kbtk.muhajirinrewwin.or.id → should show KBTK content
- https://daycare.muhajirinrewwin.or.id → should show Daycare content

## Troubleshooting

### DNS Not Propagating
- Wait up to 24 hours (usually 5-30 minutes)
- Clear your browser cache
- Try incognito mode
- Use online DNS checker: https://dnschecker.org

### Vercel Shows "Invalid Configuration"
- Double-check DNS records match Vercel's instructions exactly
- Make sure you're using CNAME records (not A records) for subdomains
- Verify the CNAME value is `cname.vercel-dns.com`

### 404 or Wrong Content Showing
- Verify middleware.ts is deployed (check latest commit is deployed)
- Check middleware logs in Vercel dashboard
- Verify subdomain routing in src/middleware.ts:26-43

## Environment Variables

Don't forget to update NEXTAUTH_URL if needed:

```env
NEXTAUTH_URL=https://muhajirinrewwin.or.id
```

## SSL Certificates

Vercel automatically provisions SSL certificates for all domains once DNS is configured correctly. Each subdomain will get its own certificate.

## Common Domain Providers

### Niagahoster / Rumahweb
- Login → Domain Management → DNS Management
- Add CNAME records as shown above

### Cloudflare
- Login → Select domain → DNS → Records
- Add CNAME records
- Important: Set proxy status to "DNS only" (gray cloud, not orange)

### GoDaddy
- Login → My Products → DNS
- Add CNAME records

## Quick Reference

**Middleware handles routing:** ✅ Already configured in src/middleware.ts
**Vercel domains:** ⚠️ Need to add all 12+ subdomains
**DNS records:** ⚠️ Need to add wildcard or individual CNAMEs
**SSL certificates:** ✅ Automatic once DNS is configured

## Estimated Time

- Adding domains to Vercel: 10-15 minutes
- Configuring DNS: 5-10 minutes
- DNS propagation: 5-30 minutes
- Total: ~30-60 minutes
