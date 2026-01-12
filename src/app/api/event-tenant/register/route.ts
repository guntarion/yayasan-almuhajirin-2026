import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { JenisProdukTenant, KegiatanEventTenant } from '@prisma/client';

// Helper to generate registration number
async function generateRegistrationNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `TN-${year}${month}`;

  const latestTenant = await prisma.eventTenant.findFirst({
    where: {
      nomorRegistrasi: {
        startsWith: prefix,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  let sequence = 1;
  if (latestTenant) {
    const match = latestTenant.nomorRegistrasi.match(/TN-\d{6}-(\d{4})/);
    if (match) {
      sequence = parseInt(match[1]) + 1;
    }
  }

  return `${prefix}-${sequence.toString().padStart(4, '0')}`;
}

interface TenantRegistrationData {
  namaEvent: string;
  // A. Informasi Tenant
  namaTenant: string;
  namaPenanggungJawab: string;
  alamat: string;
  nomorTelepon: string;
  email?: string;
  // B. Informasi Produk
  jenisProduk: JenisProdukTenant[];
  jenisProdukLainnya?: string;
  namaProdukUtama: string;
  deskripsiProduk?: string;
  // C. Kebutuhan Stan
  butuhListrik: boolean;
  kebutuhanListrik?: string;
  perlengkapanDibawa?: string;
  // D. Kegiatan
  kegiatanDiikuti: KegiatanEventTenant;
  // E. Pernyataan
  setujuSyaratKetentuan: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: TenantRegistrationData = await request.json();

    // Validate required fields
    if (!data.namaTenant?.trim()) {
      return NextResponse.json(
        { error: 'Nama Tenant / Usaha harus diisi' },
        { status: 400 }
      );
    }

    if (!data.namaPenanggungJawab?.trim()) {
      return NextResponse.json(
        { error: 'Nama Penanggung Jawab harus diisi' },
        { status: 400 }
      );
    }

    if (!data.alamat?.trim()) {
      return NextResponse.json(
        { error: 'Alamat harus diisi' },
        { status: 400 }
      );
    }

    if (!data.nomorTelepon?.trim()) {
      return NextResponse.json(
        { error: 'Nomor Telepon / WhatsApp harus diisi' },
        { status: 400 }
      );
    }

    if (!data.jenisProduk || data.jenisProduk.length === 0) {
      return NextResponse.json(
        { error: 'Pilih minimal satu jenis produk' },
        { status: 400 }
      );
    }

    if (data.jenisProduk.includes('LAINNYA') && !data.jenisProdukLainnya?.trim()) {
      return NextResponse.json(
        { error: 'Sebutkan jenis produk lainnya' },
        { status: 400 }
      );
    }

    if (!data.namaProdukUtama?.trim()) {
      return NextResponse.json(
        { error: 'Nama Produk Utama harus diisi' },
        { status: 400 }
      );
    }

    if (!data.setujuSyaratKetentuan) {
      return NextResponse.json(
        { error: 'Anda harus menyetujui syarat dan ketentuan' },
        { status: 400 }
      );
    }

    // Generate registration number
    const nomorRegistrasi = await generateRegistrationNumber();

    // Create tenant registration
    const result = await prisma.eventTenant.create({
      data: {
        nomorRegistrasi,
        namaEvent: data.namaEvent || 'Event',
        namaTenant: data.namaTenant.trim(),
        namaPenanggungJawab: data.namaPenanggungJawab.trim(),
        alamat: data.alamat.trim(),
        nomorTelepon: data.nomorTelepon.trim(),
        email: data.email?.trim() || null,
        jenisProduk: data.jenisProduk,
        jenisProdukLainnya: data.jenisProdukLainnya?.trim() || null,
        namaProdukUtama: data.namaProdukUtama.trim(),
        deskripsiProduk: data.deskripsiProduk?.trim() || null,
        butuhListrik: data.butuhListrik,
        kebutuhanListrik: data.kebutuhanListrik?.trim() || null,
        perlengkapanDibawa: data.perlengkapanDibawa?.trim() || null,
        kegiatanDiikuti: data.kegiatanDiikuti,
        setujuSyaratKetentuan: data.setujuSyaratKetentuan,
      },
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Pendaftaran tenant berhasil!',
      data: {
        nomorRegistrasi: result.nomorRegistrasi,
        namaEvent: result.namaEvent,
        namaTenant: result.namaTenant,
        namaPenanggungJawab: result.namaPenanggungJawab,
        status: result.status,
      },
    });
  } catch (error) {
    console.error('Tenant registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pendaftaran' },
      { status: 500 }
    );
  }
}

// GET endpoint to check tenant registration status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const nomorTelepon = searchParams.get('nomorTelepon');
    const nomorRegistrasi = searchParams.get('nomorRegistrasi');

    if (!nomorTelepon && !nomorRegistrasi) {
      return NextResponse.json(
        { error: 'Nomor telepon atau nomor registrasi harus diisi' },
        { status: 400 }
      );
    }

    const tenant = await prisma.eventTenant.findFirst({
      where: nomorTelepon
        ? { nomorTelepon }
        : { nomorRegistrasi: nomorRegistrasi! },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Data pendaftaran tenant tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        nomorRegistrasi: tenant.nomorRegistrasi,
        namaEvent: tenant.namaEvent,
        namaTenant: tenant.namaTenant,
        namaPenanggungJawab: tenant.namaPenanggungJawab,
        nomorTelepon: tenant.nomorTelepon,
        jenisProduk: tenant.jenisProduk,
        namaProdukUtama: tenant.namaProdukUtama,
        kegiatanDiikuti: tenant.kegiatanDiikuti,
        status: tenant.status,
        lokasiStan: tenant.lokasiStan,
        createdAt: tenant.createdAt,
      },
    });
  } catch (error) {
    console.error('Get tenant registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data pendaftaran' },
      { status: 500 }
    );
  }
}
