// src/app/api/daycare/daily-report/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { DailyReportFormData } from '@/types/daycare';

// GET - Get daily report detail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const dailyReport = await prisma.daycareDailyReport.findUnique({
      where: { id },
      include: {
        anak: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
            namaPanggilan: true,
            foto: true,
            paketLayanan: true,
            tanggalLahir: true,
            alergiMakanan: true,
            catatanKesehatan: true,
            kebiasaanTidur: true,
          },
        },
      },
    });

    if (!dailyReport) {
      return NextResponse.json(
        { error: 'Daily report tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(dailyReport);
  } catch (error) {
    console.error('Error fetching daily report:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data daily report' },
      { status: 500 }
    );
  }
}

// PUT - Update daily report
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: DailyReportFormData = await request.json();

    // Check if daily report exists
    const existingReport = await prisma.daycareDailyReport.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return NextResponse.json(
        { error: 'Daily report tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update daily report
    const updatedReport = await prisma.daycareDailyReport.update({
      where: { id },
      data: {
        guruPengisi: body.guruPengisi || null,
        // Perilaku
        moodSikap: body.moodSikap || null,
        interaksiTeman: body.interaksiTeman || null,
        catatanPerilaku: body.catatanPerilaku || null,
        // Aktivitas
        partisipasiBelajar: body.partisipasiBelajar || null,
        responBermain: body.responBermain || null,
        catatanAktivitas: body.catatanAktivitas || null,
        // Makan
        makanSiang: body.makanSiang || null,
        snack: body.snack || null,
        catatanMakan: body.catatanMakan || null,
        // Tidur
        tidurSiang: body.tidurSiang || null,
        durasiTidur: body.durasiTidur || null,
        catatanTidur: body.catatanTidur || null,
        // Kegiatan
        kegiatanHariIni: body.kegiatanHariIni
          ? JSON.stringify(body.kegiatanHariIni)
          : null,
        // Catatan
        catatanGuru: body.catatanGuru || null,
      },
      include: {
        anak: {
          select: {
            id: true,
            nomorInduk: true,
            namaLengkap: true,
            foto: true,
          },
        },
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('Error updating daily report:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate daily report' },
      { status: 500 }
    );
  }
}

// DELETE - Delete daily report
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if daily report exists
    const existingReport = await prisma.daycareDailyReport.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return NextResponse.json(
        { error: 'Daily report tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete daily report
    await prisma.daycareDailyReport.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Daily report berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting daily report:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus daily report' },
      { status: 500 }
    );
  }
}
