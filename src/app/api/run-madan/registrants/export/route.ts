import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/utils/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// Activity preference labels for CSV
const ACTIVITY_LABELS: Record<string, string> = {
  FULL_LARI: 'Full Lari',
  LARI_JALAN: 'Lari + Jalan',
  JALAN: 'Jalan Saja',
};

// Payment status labels for CSV
const PAYMENT_STATUS_LABELS: Record<string, string> = {
  belum_bayar: 'Belum Bayar',
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  lunas: 'Lunas',
  ditolak: 'Ditolak',
};

// GET endpoint - Export running registrants to CSV (admin only)
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

    // Fetch all running registrants with their participants
    const registrants = await prisma.runMadanRegistrant.findMany({
      include: {
        participants: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Build CSV content
    const headers = [
      'No',
      'No Registrasi',
      'Nama Pendaftar',
      'No HP',
      'Email',
      'Alamat',
      'Status Pembayaran',
      'Tanggal Bayar',
      'Tanggal Daftar',
      'No Peserta',
      'Nama Peserta',
      'Jenis Kelamin',
      'Usia',
      'Preferensi Aktivitas',
      'Ukuran Kaos',
      'No Bib',
    ];

    const rows: string[][] = [];
    let rowNumber = 1;

    registrants.forEach((registrant) => {
      registrant.participants.forEach((participant, idx) => {
        const activityLabel = ACTIVITY_LABELS[participant.preferensiAktivitas] || participant.preferensiAktivitas;
        const paymentStatus = PAYMENT_STATUS_LABELS[registrant.statusPembayaran] || registrant.statusPembayaran;

        rows.push([
          rowNumber.toString(),
          idx === 0 ? registrant.nomorRegistrasi : '',
          idx === 0 ? registrant.nama : '',
          idx === 0 ? registrant.nomorHP : '',
          idx === 0 ? (registrant.email || '') : '',
          idx === 0 ? registrant.alamat.replace(/\n/g, ' ') : '',
          idx === 0 ? paymentStatus : '',
          idx === 0 ? (registrant.tanggalBayar ? new Date(registrant.tanggalBayar).toLocaleDateString('id-ID') : '') : '',
          idx === 0 ? new Date(registrant.createdAt).toLocaleDateString('id-ID') : '',
          idx.toString(),
          participant.namaLengkap,
          participant.jenisKelamin === 'lelaki' ? 'Laki-laki' : 'Perempuan',
          participant.usia?.toString() || '',
          activityLabel,
          participant.ukuranKaos,
          participant.nomorBib || '',
        ]);

        rowNumber++;
      });
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
    const filename = `run-madan-2026-${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export running registrants error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengexport data pendaftaran Running' },
      { status: 500 }
    );
  }
}
