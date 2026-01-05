# Struktur Unit Yayasan Al Muhajirin

Folder ini berisi halaman-halaman untuk setiap unit di bawah Yayasan Al Muhajirin.

## Daftar Unit dan Sub-domain

| Unit | Sub-domain | Status |
|------|-----------|--------|
| Ketakmiran Masjid | masjid.muhajirinrewwin.or.id | ✅ Selesai |
| Usaha & Pengadaan | usaha.muhajirinrewwin.or.id | ✅ Selesai |
| Kolam Renang | pool.muhajirinrewwin.or.id | ✅ Selesai |
| Remaskidz | remas.muhajirinrewwin.or.id | ✅ Selesai |
| Kemuslimatan | kemuslimatan.muhajirinrewwin.or.id | 🔄 Template siap |
| Daycare | daycare.muhajirinrewwin.or.id | 🔄 Template siap |
| KBTK | kbtk.muhajirinrewwin.or.id | ✅ Selesai |
| TPQ | tpq.muhajirinrewwin.or.id | 🔄 Template siap |
| LAZMU | lazmu.muhajirinrewwin.or.id | 🔄 Template siap |
| WAFMU | wafmu.muhajirinrewwin.or.id | 🔄 Template siap |
| Ambulans | ambulans.muhajirinrewwin.or.id | 🔄 Template siap |
| Poliklinik | poliklinik.muhajirinrewwin.or.id | 🔄 Template siap |

## Struktur Folder Unit

Setiap unit memiliki struktur folder yang sama:

```
units/
└── [nama-unit]/
    ├── layout.tsx      # Layout khusus unit
    ├── page.tsx        # Halaman utama unit
    └── [sub-pages]/    # Halaman tambahan (opsional)
```

## Template untuk Unit Baru

### layout.tsx
```typescript
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Nama Unit - Al Muhajirin',
  description: 'Deskripsi unit di Yayasan Al Muhajirin',
};

export default function NamaUnitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
```

### page.tsx
```typescript
import React from 'react';

export default function NamaUnitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nama Unit
          </h1>
          <p className="text-lg text-muted-foreground">
            Yayasan Al Muhajirin Rewwin
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div className="bg-card p-8 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold mb-4">
              Selamat Datang
            </h2>
            <p className="mb-4">
              Deskripsi lengkap unit.
            </p>
            <div className="mt-6 space-y-2">
              <h3 className="text-xl font-semibold">Informasi Kontak</h3>
              <p>Website: subdomain.muhajirinrewwin.or.id</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Testing di Development

Untuk testing subdomain di local development:

1. Edit file `/etc/hosts` (Linux/Mac) atau `C:\Windows\System32\drivers\etc\hosts` (Windows)
2. Tambahkan entry:
   ```
   127.0.0.1 masjid.localhost
   127.0.0.1 kbtk.localhost
   127.0.0.1 pool.localhost
   # ... dst untuk unit lainnya
   ```
3. Akses melalui browser: `http://masjid.localhost:3000`

Atau gunakan format subdomain langsung:
- Format: `http://subdomain.localhost:3000`
- Contoh: `http://masjid.localhost:3000`, `http://kbtk.localhost:3000`

## Deployment di Vercel

1. Tambahkan semua domain/subdomain di Vercel project settings
2. Configure DNS di registrar domain untuk point ke Vercel
3. Middleware otomatis akan handle routing ke unit yang sesuai

Vercel akan otomatis mendeteksi middleware dan menerapkan routing subdomain.
