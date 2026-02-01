import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/utils/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// Product type labels for CSV
const PRODUCT_LABELS: Record<string, string> = {
  MAKANAN: 'Makanan',
  MINUMAN: 'Minuman',
  PRODUK_UMKM: 'Produk UMKM',
  PRODUK_KESEHATAN: 'Produk Kesehatan',
  LAINNYA: 'Lainnya',
};

// Activity labels for CSV
const ACTIVITY_LABELS: Record<string, string> = {
  SENAM_PAGI: 'Senam Pagi',
  FUN_RUN: '3K Fun Run',
  KEDUANYA: 'Keduanya',
};

// Payment status labels for CSV
const PAYMENT_LABELS: Record<string, string> = {
  belum_bayar: 'Belum Bayar',
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  lunas: 'Lunas',
  ditolak: 'Ditolak',
};

// GET endpoint - Export tenants to CSV (admin only)
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Login required' }, { status: 401 });
    }

    // Check role (admin, sekretariat, or moderator)
    const allowedRoles = ['admin', 'sekretariat', 'moderator'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    // Fetch all tenants
    const tenants = await prisma.eventTenant.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Build CSV content
    const headers = [
      'No',
      'No Registrasi',
      'Nama Event',
      'Nama Tenant',
      'Nama Penanggung Jawab',
      'No Telepon',
      'Email',
      'Alamat',
      'Jenis Produk',
      'Jenis Produk Lainnya',
      'Nama Produk Utama',
      'Deskripsi Produk',
      'Butuh Listrik',
      'Kebutuhan Listrik',
      'Perlengkapan Dibawa',
      'Kegiatan Diikuti',
      'Status Pembayaran',
      'Tanggal Bayar',
      'Status',
      'Lokasi Stan',
      'Tanggal Daftar',
    ];

    const rows: string[][] = [];

    tenants.forEach((tenant, index) => {
      // Parse product types
      const productTypes = tenant.jenisProduk
        .map((p) => PRODUCT_LABELS[p] || p)
        .join(', ');

      rows.push([
        (index + 1).toString(),
        tenant.nomorRegistrasi,
        tenant.namaEvent,
        tenant.namaTenant,
        tenant.namaPenanggungJawab,
        tenant.nomorTelepon,
        tenant.email || '',
        tenant.alamat.replace(/\n/g, ' '),
        productTypes,
        tenant.jenisProdukLainnya || '',
        tenant.namaProdukUtama,
        tenant.deskripsiProduk?.replace(/\n/g, ' ') || '',
        tenant.butuhListrik ? 'Ya' : 'Tidak',
        tenant.kebutuhanListrik || '',
        tenant.perlengkapanDibawa?.replace(/\n/g, ' ') || '',
        ACTIVITY_LABELS[tenant.kegiatanDiikuti] || tenant.kegiatanDiikuti,
        PAYMENT_LABELS[tenant.statusPembayaran] || tenant.statusPembayaran,
        tenant.tanggalBayar ? new Date(tenant.tanggalBayar).toLocaleDateString('id-ID') : '',
        tenant.status,
        tenant.lokasiStan || '',
        new Date(tenant.createdAt).toLocaleDateString('id-ID'),
      ]);
    });

    // Create CSV string
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    // Add BOM for Excel compatibility
    const bom = '\ufeff';
    const csvWithBom = bom + csvContent;

    // Return CSV file
    const filename = `tenant-run-madan-2026-${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export tenants error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengexport data tenant' },
      { status: 500 }
    );
  }
}
