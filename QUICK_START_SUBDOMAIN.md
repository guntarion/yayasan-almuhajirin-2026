# Quick Start Guide - Multi-Subdomain Setup

## Development

### 1. Start Development Server
```bash
npm run dev
```

### 2. Access Subdomains Locally

**Opsi A: Langsung via browser** (Rekomendasi)
```
http://masjid.localhost:3000
http://kbtk.localhost:3000
http://pool.localhost:3000
http://usaha.localhost:3000
# ... dst
```

**Opsi B: Edit /etc/hosts** (Opsional)
```bash
# Mac/Linux
sudo nano /etc/hosts

# Windows
notepad C:\Windows\System32\drivers\etc\hosts
```

Tambahkan:
```
127.0.0.1 masjid.localhost
127.0.0.1 kbtk.localhost
127.0.0.1 pool.localhost
127.0.0.1 usaha.localhost
127.0.0.1 remas.localhost
127.0.0.1 kemuslimatan.localhost
127.0.0.1 daycare.localhost
127.0.0.1 tpq.localhost
127.0.0.1 lazmu.localhost
127.0.0.1 wafmu.localhost
127.0.0.1 ambulans.localhost
127.0.0.1 poliklinik.localhost
```

### 3. Test Routing
- Main site: `http://localhost:3000`
- Unit Masjid: `http://masjid.localhost:3000`
- Unit KBTK: `http://kbtk.localhost:3000`

## Deployment ke Vercel

### 1. Push ke Git
```bash
git add .
git commit -m "Setup multi-subdomain architecture"
git push
```

### 2. Configure Vercel Project

Di Vercel Dashboard → Project Settings → Domains:

Tambahkan semua domain:
```
almuhajirin.or.id
masjid.almuhajirin.or.id
kbtk.almuhajirin.or.id
pool.almuhajirin.or.id
usaha.almuhajirin.or.id
remas.almuhajirin.or.id
kemuslimatan.almuhajirin.or.id
daycare.almuhajirin.or.id
tpq.almuhajirin.or.id
lazmu.almuhajirin.or.id
wafmu.almuhajirin.or.id
ambulans.almuhajirin.or.id
poliklinik.almuhajirin.or.id
```

### 3. Configure DNS

Di registrar domain (contoh: Cloudflare, Namecheap):

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21 (Vercel IP)
```

**CNAME Records untuk Subdomain:**
```
Type: CNAME
Name: masjid
Value: cname.vercel-dns.com

Type: CNAME
Name: kbtk
Value: cname.vercel-dns.com

# ... ulangi untuk semua subdomain
```

### 4. Verify Deployment
- Tunggu propagasi DNS (5-30 menit)
- Test semua subdomain
- Verify SSL certificate aktif

## Tambah Unit Baru

### 1. Buat Folder Unit
```bash
mkdir -p src/app/units/namaunit
```

### 2. Buat Layout
```typescript
// src/app/units/namaunit/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nama Unit - Al Muhajirin',
  description: 'Deskripsi unit',
};

export default function NamaUnitLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
```

### 3. Buat Page
```typescript
// src/app/units/namaunit/page.tsx
export default function NamaUnitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">Nama Unit</h1>
    </div>
  );
}
```

### 4. Update Middleware
```typescript
// src/middleware.ts
const SUBDOMAIN_ROUTES: Record<string, string> = {
  // ... existing routes
  'namaunit': '/units/namaunit',
};
```

### 5. Deploy
```bash
git add .
git commit -m "Add new unit: namaunit"
git push
```

Tambahkan subdomain di Vercel dan DNS.

## Troubleshooting

**Subdomain tidak berfungsi di local:**
- Pastikan format: `subdomain.localhost:3000`
- Clear browser cache
- Cek middleware.ts sudah benar

**404 di production:**
- Verify subdomain sudah ditambahkan di Vercel
- Cek DNS sudah terkonfigurasi
- Tunggu propagasi DNS

**Middleware tidak jalan:**
- Cek matcher config di middleware.ts
- Pastikan middleware.ts di folder src/
- Rebuild: `npm run build`
