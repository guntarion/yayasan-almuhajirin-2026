import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

// Normalize phone number to Indonesian format (62XXXXXXXXX)
function normalizePhoneNumber(phone: string): string[] {
  const cleaned = phone.trim().replace(/\D/g, ''); // Remove non-digits

  const variants: string[] = [];

  // If starts with 62
  if (cleaned.startsWith('62')) {
    variants.push(cleaned);
    variants.push('0' + cleaned.substring(2)); // 62817... -> 0817...
  }
  // If starts with 0
  else if (cleaned.startsWith('0')) {
    variants.push(cleaned);
    variants.push('62' + cleaned.substring(1)); // 0817... -> 62817...
  }
  // If no prefix
  else {
    variants.push('62' + cleaned); // 817... -> 62817...
    variants.push('0' + cleaned); // 817... -> 0817...
  }

  return variants;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'Nomor telepon harus diisi' }, { status: 400 });
    }

    // Normalize phone number and get variants
    const phoneVariants = normalizePhoneNumber(phone);

    // Search registrants by phone number variants
    const registrants = await prisma.runMadanRegistrant.findMany({
      where: {
        nomorHP: {
          in: phoneVariants,
        },
      },
      include: { participants: true },
    });

    if (registrants.length === 0) {
      return NextResponse.json({ error: 'Data peserta tidak ditemukan' }, { status: 404 });
    }

    // Collect all participants from all matching registrants
    const participants = registrants.flatMap((registrant) =>
      registrant.participants.map((p) => ({
        namaLengkap: p.namaLengkap,
        nomorBib: p.nomorBib,
        preferensiAktivitas: p.preferensiAktivitas,
        jenisKelamin: p.jenisKelamin,
        waktuFinish: p.waktuFinish,
        nomorRegistrasi: registrant.nomorRegistrasi,
      }))
    );

    return NextResponse.json({ success: true, data: participants });
  } catch (error) {
    console.error('Certificate lookup error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mencari data peserta' }, { status: 500 });
  }
}
