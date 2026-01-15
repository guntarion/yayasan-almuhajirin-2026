import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/utils/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// Health condition labels for CSV
const HEALTH_LABELS: Record<string, string> = {
  HIPERTENSI: 'Hipertensi',
  DIABETES: 'Diabetes',
  ASAM_URAT: 'Asam Urat',
  KOLESTEROL: 'Kolesterol',
  JANTUNG: 'Jantung',
  ASMA: 'Asma',
  STROKE: 'Stroke',
  NYERI_SENDI: 'Nyeri Sendi',
  OSTEOPOROSIS: 'Osteoporosis',
  VERTIGO: 'Vertigo',
  LAINNYA: 'Lainnya',
  TIDAK_ADA: 'Tidak Ada',
};

// Community interest labels for CSV
const COMMUNITY_LABELS: Record<string, string> = {
  SENAM_SEHAT: 'Senam Sehat',
  SENAM_AQUATIK_LANSIA: 'Senam Aquatik Lansia',
  LINE_DANCE: 'Line Dance',
  POUND_FITNESS: 'Pound Fitness',
};

// GET endpoint - Export senam registrants to CSV (admin only)
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

    // Fetch all senam registrants with their participants
    const registrants = await prisma.senamRegistrant.findMany({
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
      'Status Konfirmasi',
      'Tanggal Konfirmasi',
      'Tanggal Daftar',
      'No Kupon',
      'Nama Peserta',
      'Jenis Kelamin',
      'Usia',
      'Kondisi Kesehatan',
      'Kondisi Lainnya',
      'Minat Komunitas',
      'Sudah Hadir',
    ];

    const rows: string[][] = [];
    let rowNumber = 1;

    registrants.forEach((registrant) => {
      registrant.participants.forEach((participant, idx) => {
        // Parse health conditions
        let healthConditions = '';
        try {
          const conditions = JSON.parse(participant.kondisiKesehatan || '[]');
          healthConditions = conditions.map((c: string) => HEALTH_LABELS[c] || c).join(', ');
        } catch {
          healthConditions = participant.kondisiKesehatan || '';
        }

        // Parse community interests
        let communityInterests = '';
        try {
          const interests = JSON.parse(participant.minatKomunitas || '[]');
          communityInterests = interests.map((i: string) => COMMUNITY_LABELS[i] || i).join(', ');
        } catch {
          communityInterests = participant.minatKomunitas || '';
        }

        rows.push([
          rowNumber.toString(),
          idx === 0 ? registrant.nomorRegistrasi : '',
          idx === 0 ? registrant.nama : '',
          idx === 0 ? registrant.nomorHP : '',
          idx === 0 ? (registrant.email || '') : '',
          idx === 0 ? registrant.alamat.replace(/\n/g, ' ') : '',
          idx === 0 ? (registrant.statusKonfirmasi === 'terkonfirmasi' ? 'Terkonfirmasi' : 'Belum Terkonfirmasi') : '',
          idx === 0 ? (registrant.tanggalKonfirmasi ? new Date(registrant.tanggalKonfirmasi).toLocaleDateString('id-ID') : '') : '',
          idx === 0 ? new Date(registrant.createdAt).toLocaleDateString('id-ID') : '',
          participant.nomorKupon || '',
          participant.namaLengkap,
          participant.jenisKelamin === 'lelaki' ? 'Laki-laki' : 'Perempuan',
          participant.usia?.toString() || '',
          healthConditions,
          participant.kondisiLainnya || '',
          communityInterests,
          participant.sudahHadir ? 'Ya' : 'Tidak',
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
    const filename = `senam-sehat-run-madan-2026-${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export senam registrants error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengexport data pendaftaran senam' },
      { status: 500 }
    );
  }
}
