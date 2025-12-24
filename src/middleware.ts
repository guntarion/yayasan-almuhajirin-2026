import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Daftar subdomain yang valid dan path tujuannya
const SUBDOMAIN_ROUTES: Record<string, string> = {
  'usaha': '/units/usaha',
  'pool': '/units/pool',
  'masjid': '/units/masjid',
  'remas': '/units/remas',
  'kemuslimatan': '/units/kemuslimatan',
  'daycare': '/units/daycare',
  'kbtk': '/units/kbtk',
  'tpq': '/units/tpq',
  'lazmu': '/units/lazmu',
  'wafmu': '/units/wafmu',
  'ambulans': '/units/ambulans',
  'poliklinik': '/units/poliklinik',
  'keuangan': '/keuangan',
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Ekstrak subdomain dari hostname
  // Format: subdomain.almuhajirin.or.id atau subdomain.localhost:3000
  const hostParts = hostname.split('.');
  
  // Jika di localhost, ambil bagian pertama sebelum .localhost
  // Jika di production, ambil bagian pertama sebelum .almuhajirin
  let subdomain = '';
  
  if (hostname.includes('localhost')) {
    // localhost:3000 atau subdomain.localhost:3000
    if (hostParts.length >= 2 && hostParts[0] !== 'localhost') {
      subdomain = hostParts[0];
    }
  } else {
    // almuhajirin.or.id atau subdomain.almuhajirin.or.id
    if (hostParts.length >= 4) {
      subdomain = hostParts[0];
    }
  }
  
  // Jika ada subdomain yang valid, rewrite ke path unit
  if (subdomain && SUBDOMAIN_ROUTES[subdomain]) {
    const targetPath = SUBDOMAIN_ROUTES[subdomain];
    
    // Rewrite URL ke path unit sambil mempertahankan pathname dan query
    const newUrl = new URL(`${targetPath}${url.pathname}`, request.url);
    newUrl.search = url.search;
    
    return NextResponse.rewrite(newUrl);
  }
  
  // Jika bukan subdomain unit, lanjutkan normal (domain utama atau dashboard)
  return NextResponse.next();
}

// Konfigurasi matcher - jalankan middleware untuk semua route kecuali static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
