// src/app/api/kbtk/siswa/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { SiswaFormData } from '@/types/kbtk';

// GET - Get siswa detail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const siswa = await prisma.kbtkSiswa.findUnique({
      where: { id },
      include: {
        orangTua: {
          orderBy: { isPrimary: 'desc' },
        },
        pendaftaran: {
          include: {
            pembayaran: {
              orderBy: { tanggalBayar: 'desc' },
            },
          },
        },
        tagihanSpp: {
          include: {
            pembayaran: {
              orderBy: { tanggalBayar: 'desc' },
            },
          },
          orderBy: [{ tahun: 'desc' }, { bulan: 'desc' }],
        },
        _count: {
          select: {
            orangTua: true,
            tagihanSpp: true,
          },
        },
      },
    });

    if (!siswa) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate pendaftaran payment summary
    let pendaftaranWithSummary = null;
    if (siswa.pendaftaran) {
      const totalBayar = siswa.pendaftaran.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      pendaftaranWithSummary = {
        ...siswa.pendaftaran,
        _totalBayar: totalBayar,
        _sisaTagihan: Number(siswa.pendaftaran.biayaPendaftaran) - totalBayar,
      };
    }

    // Calculate tagihan SPP summaries
    const tagihanWithSummary = siswa.tagihanSpp.map((tagihan) => {
      const totalBayar = tagihan.pembayaran.reduce(
        (sum, p) => sum + Number(p.nominal),
        0
      );
      return {
        ...tagihan,
        _totalBayar: totalBayar,
        _sisaTagihan: Number(tagihan.totalTagihan) - totalBayar,
      };
    });

    return NextResponse.json({
      ...siswa,
      pendaftaran: pendaftaranWithSummary,
      tagihanSpp: tagihanWithSummary,
    });
  } catch (error) {
    console.error('Error fetching siswa:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data siswa' },
      { status: 500 }
    );
  }
}

// PUT - Update siswa
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: SiswaFormData = await request.json();

    // Check if siswa exists
    const existingSiswa = await prisma.kbtkSiswa.findUnique({
      where: { id },
      include: { orangTua: true },
    });

    if (!existingSiswa) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update siswa and orang tua in transaction
    const updatedSiswa = await prisma.$transaction(async (tx) => {
      // Update siswa
      const siswa = await tx.kbtkSiswa.update({
        where: { id },
        data: {
          namaLengkap: body.namaLengkap,
          namaPanggilan: body.namaPanggilan || null,
          jenisKelamin: body.jenisKelamin,
          tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : null,
          tempatLahir: body.tempatLahir || null,
          foto: body.foto || null,
          kelompokLevel: body.kelompokLevel,
          kelompokKelas: body.kelompokKelas || 'A',
          tahunAjaran: body.tahunAjaran,
          tanggalMasuk: body.tanggalMasuk ? new Date(body.tanggalMasuk) : undefined,
          status: body.status || 'aktif',
          alamat: body.alamat || null,
          catatanKhusus: body.catatanKhusus || null,
        },
      });

      // Handle orang tua updates if provided
      if (body.orangTua) {
        // Get existing orang tua IDs
        const existingOrangTuaIds = existingSiswa.orangTua.map((ot) => ot.id);
        const updatedOrangTuaIds = body.orangTua
          .filter((ot) => ot.id)
          .map((ot) => ot.id as string);

        // Delete orang tua that are not in the update
        const toDelete = existingOrangTuaIds.filter(
          (id) => !updatedOrangTuaIds.includes(id)
        );
        if (toDelete.length > 0) {
          await tx.kbtkOrangTua.deleteMany({
            where: { id: { in: toDelete } },
          });
        }

        // Update or create orang tua
        for (let i = 0; i < body.orangTua.length; i++) {
          const ot = body.orangTua[i];
          if (ot.id) {
            // Update existing
            await tx.kbtkOrangTua.update({
              where: { id: ot.id },
              data: {
                nama: ot.nama,
                relasi: ot.relasi,
                nomorHP: ot.nomorHP || null,
                email: ot.email || null,
                pekerjaan: ot.pekerjaan || null,
                alamat: ot.alamat || null,
                isPrimary: ot.isPrimary ?? false,
              },
            });
          } else {
            // Create new
            await tx.kbtkOrangTua.create({
              data: {
                siswaId: id,
                nama: ot.nama,
                relasi: ot.relasi,
                nomorHP: ot.nomorHP || null,
                email: ot.email || null,
                pekerjaan: ot.pekerjaan || null,
                alamat: ot.alamat || null,
                isPrimary: ot.isPrimary ?? i === 0,
              },
            });
          }
        }
      }

      return siswa;
    });

    // Fetch updated siswa with relations
    const result = await prisma.kbtkSiswa.findUnique({
      where: { id: updatedSiswa.id },
      include: {
        orangTua: true,
        pendaftaran: true,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating siswa:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data siswa' },
      { status: 500 }
    );
  }
}

// DELETE - Delete siswa
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if siswa exists
    const existingSiswa = await prisma.kbtkSiswa.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tagihanSpp: true,
          },
        },
      },
    });

    if (!existingSiswa) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check for unpaid tagihan
    const unpaidTagihan = await prisma.kbtkTagihanSpp.count({
      where: {
        siswaId: id,
        status: { not: 'lunas' },
      },
    });

    if (unpaidTagihan > 0) {
      return NextResponse.json(
        { error: `Siswa masih memiliki ${unpaidTagihan} tagihan yang belum lunas` },
        { status: 400 }
      );
    }

    // Delete siswa (cascade will delete orang tua, pendaftaran, tagihan, pembayaran)
    await prisma.kbtkSiswa.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Siswa berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting siswa:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data siswa' },
      { status: 500 }
    );
  }
}
