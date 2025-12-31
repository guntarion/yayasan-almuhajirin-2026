-- CreateEnum
CREATE TYPE "DaycarePaketLayanan" AS ENUM ('FULLDAY', 'AFTER_SCHOOL', 'HARIAN');

-- CreateEnum
CREATE TYPE "DaycareStatusAnak" AS ENUM ('aktif', 'cuti', 'selesai', 'keluar');

-- CreateEnum
CREATE TYPE "DaycareStatusPendaftaran" AS ENUM ('terdaftar', 'aktif', 'batal');

-- CreateEnum
CREATE TYPE "DaycareSchemaPembayaran" AS ENUM ('lunas', 'angsuran');

-- CreateEnum
CREATE TYPE "DaycareStatusTagihan" AS ENUM ('belum_bayar', 'bayar_sebagian', 'lunas');

-- CreateEnum
CREATE TYPE "DaycareMetodePembayaran" AS ENUM ('cash', 'transfer');

-- CreateEnum
CREATE TYPE "DaycareRelasi" AS ENUM ('ayah', 'ibu', 'wali');

-- CreateTable
CREATE TABLE "daycare_anak" (
    "id" TEXT NOT NULL,
    "nomorInduk" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "namaPanggilan" TEXT,
    "jenisKelamin" "Gender" NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "tempatLahir" TEXT,
    "foto" TEXT,
    "paketLayanan" "DaycarePaketLayanan" NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "DaycareStatusAnak" NOT NULL DEFAULT 'aktif',
    "alamat" TEXT,
    "alergiMakanan" TEXT,
    "catatanKesehatan" TEXT,
    "kebiasaanTidur" TEXT,
    "catatanKhusus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daycare_anak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daycare_orang_tua" (
    "id" TEXT NOT NULL,
    "anakId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "relasi" "DaycareRelasi" NOT NULL,
    "nomorHP" TEXT,
    "nomorHPDarurat" TEXT,
    "email" TEXT,
    "pekerjaan" TEXT,
    "alamat" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daycare_orang_tua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daycare_paket" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tipePaket" "DaycarePaketLayanan" NOT NULL,
    "deskripsi" TEXT,
    "rentangUsia" TEXT,
    "jamLayanan" TEXT,
    "sistemPembayaran" TEXT,
    "hargaDefault" DECIMAL(15,2) NOT NULL,
    "fiturLayanan" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daycare_paket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daycare_pendaftaran" (
    "id" TEXT NOT NULL,
    "anakId" TEXT NOT NULL,
    "tanggalDaftar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalMulai" TIMESTAMP(3),
    "paketDipilih" "DaycarePaketLayanan" NOT NULL,
    "biayaPendaftaran" DECIMAL(15,2) NOT NULL,
    "schemaPembayaran" "DaycareSchemaPembayaran" NOT NULL DEFAULT 'lunas',
    "status" "DaycareStatusPendaftaran" NOT NULL DEFAULT 'terdaftar',
    "tanggalAktif" TIMESTAMP(3),
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daycare_pendaftaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daycare_pembayaran_pendaftaran" (
    "id" TEXT NOT NULL,
    "pendaftaranId" TEXT NOT NULL,
    "tanggalBayar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nominal" DECIMAL(15,2) NOT NULL,
    "metodePembayaran" "DaycareMetodePembayaran" NOT NULL DEFAULT 'cash',
    "buktiTransfer" TEXT,
    "catatan" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daycare_pembayaran_pendaftaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daycare_tagihan_bulanan" (
    "id" TEXT NOT NULL,
    "anakId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "paket" "DaycarePaketLayanan" NOT NULL,
    "nominal" DECIMAL(15,2) NOT NULL,
    "diskon" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalTagihan" DECIMAL(15,2) NOT NULL,
    "status" "DaycareStatusTagihan" NOT NULL DEFAULT 'belum_bayar',
    "tanggalJatuhTempo" TIMESTAMP(3),
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daycare_tagihan_bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daycare_pembayaran_bulanan" (
    "id" TEXT NOT NULL,
    "tagihanId" TEXT NOT NULL,
    "tanggalBayar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nominal" DECIMAL(15,2) NOT NULL,
    "metodePembayaran" "DaycareMetodePembayaran" NOT NULL DEFAULT 'cash',
    "buktiTransfer" TEXT,
    "catatan" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daycare_pembayaran_bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daycare_kehadiran_harian" (
    "id" TEXT NOT NULL,
    "anakId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jamMasuk" TIMESTAMP(3),
    "jamPulang" TIMESTAMP(3),
    "isHadir" BOOLEAN NOT NULL DEFAULT true,
    "catatan" TEXT,
    "tagihanId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daycare_kehadiran_harian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daycare_tagihan_harian" (
    "id" TEXT NOT NULL,
    "anakId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "nominal" DECIMAL(15,2) NOT NULL,
    "status" "DaycareStatusTagihan" NOT NULL DEFAULT 'belum_bayar',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daycare_tagihan_harian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daycare_pembayaran_harian" (
    "id" TEXT NOT NULL,
    "tagihanId" TEXT NOT NULL,
    "tanggalBayar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nominal" DECIMAL(15,2) NOT NULL,
    "metodePembayaran" "DaycareMetodePembayaran" NOT NULL DEFAULT 'cash',
    "buktiTransfer" TEXT,
    "catatan" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daycare_pembayaran_harian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daycare_daily_report" (
    "id" TEXT NOT NULL,
    "anakId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "guruPengisi" TEXT,
    "moodSikap" INTEGER,
    "interaksiTeman" INTEGER,
    "catatanPerilaku" TEXT,
    "partisipasiBelajar" INTEGER,
    "responBermain" INTEGER,
    "catatanAktivitas" TEXT,
    "makanSiang" INTEGER,
    "snack" INTEGER,
    "catatanMakan" TEXT,
    "tidurSiang" INTEGER,
    "durasiTidur" TEXT,
    "catatanTidur" TEXT,
    "kegiatanHariIni" TEXT,
    "catatanGuru" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daycare_daily_report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daycare_anak_nomorInduk_key" ON "daycare_anak"("nomorInduk");

-- CreateIndex
CREATE INDEX "daycare_anak_paketLayanan_idx" ON "daycare_anak"("paketLayanan");

-- CreateIndex
CREATE INDEX "daycare_anak_status_idx" ON "daycare_anak"("status");

-- CreateIndex
CREATE INDEX "daycare_anak_namaLengkap_idx" ON "daycare_anak"("namaLengkap");

-- CreateIndex
CREATE INDEX "daycare_anak_tanggalMulai_idx" ON "daycare_anak"("tanggalMulai");

-- CreateIndex
CREATE INDEX "daycare_orang_tua_anakId_idx" ON "daycare_orang_tua"("anakId");

-- CreateIndex
CREATE INDEX "daycare_orang_tua_isPrimary_idx" ON "daycare_orang_tua"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "daycare_paket_tipePaket_key" ON "daycare_paket"("tipePaket");

-- CreateIndex
CREATE INDEX "daycare_paket_isActive_idx" ON "daycare_paket"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "daycare_pendaftaran_anakId_key" ON "daycare_pendaftaran"("anakId");

-- CreateIndex
CREATE INDEX "daycare_pendaftaran_status_idx" ON "daycare_pendaftaran"("status");

-- CreateIndex
CREATE INDEX "daycare_pendaftaran_paketDipilih_idx" ON "daycare_pendaftaran"("paketDipilih");

-- CreateIndex
CREATE INDEX "daycare_pembayaran_pendaftaran_pendaftaranId_idx" ON "daycare_pembayaran_pendaftaran"("pendaftaranId");

-- CreateIndex
CREATE INDEX "daycare_pembayaran_pendaftaran_tanggalBayar_idx" ON "daycare_pembayaran_pendaftaran"("tanggalBayar");

-- CreateIndex
CREATE INDEX "daycare_tagihan_bulanan_status_idx" ON "daycare_tagihan_bulanan"("status");

-- CreateIndex
CREATE INDEX "daycare_tagihan_bulanan_bulan_tahun_idx" ON "daycare_tagihan_bulanan"("bulan", "tahun");

-- CreateIndex
CREATE INDEX "daycare_tagihan_bulanan_paket_idx" ON "daycare_tagihan_bulanan"("paket");

-- CreateIndex
CREATE UNIQUE INDEX "daycare_tagihan_bulanan_anakId_bulan_tahun_key" ON "daycare_tagihan_bulanan"("anakId", "bulan", "tahun");

-- CreateIndex
CREATE INDEX "daycare_pembayaran_bulanan_tagihanId_idx" ON "daycare_pembayaran_bulanan"("tagihanId");

-- CreateIndex
CREATE INDEX "daycare_pembayaran_bulanan_tanggalBayar_idx" ON "daycare_pembayaran_bulanan"("tanggalBayar");

-- CreateIndex
CREATE INDEX "daycare_kehadiran_harian_tanggal_idx" ON "daycare_kehadiran_harian"("tanggal");

-- CreateIndex
CREATE INDEX "daycare_kehadiran_harian_isHadir_idx" ON "daycare_kehadiran_harian"("isHadir");

-- CreateIndex
CREATE UNIQUE INDEX "daycare_kehadiran_harian_anakId_tanggal_key" ON "daycare_kehadiran_harian"("anakId", "tanggal");

-- CreateIndex
CREATE INDEX "daycare_tagihan_harian_status_idx" ON "daycare_tagihan_harian"("status");

-- CreateIndex
CREATE INDEX "daycare_tagihan_harian_tanggal_idx" ON "daycare_tagihan_harian"("tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "daycare_tagihan_harian_anakId_tanggal_key" ON "daycare_tagihan_harian"("anakId", "tanggal");

-- CreateIndex
CREATE INDEX "daycare_pembayaran_harian_tagihanId_idx" ON "daycare_pembayaran_harian"("tagihanId");

-- CreateIndex
CREATE INDEX "daycare_pembayaran_harian_tanggalBayar_idx" ON "daycare_pembayaran_harian"("tanggalBayar");

-- CreateIndex
CREATE INDEX "daycare_daily_report_tanggal_idx" ON "daycare_daily_report"("tanggal");

-- CreateIndex
CREATE INDEX "daycare_daily_report_anakId_idx" ON "daycare_daily_report"("anakId");

-- CreateIndex
CREATE UNIQUE INDEX "daycare_daily_report_anakId_tanggal_key" ON "daycare_daily_report"("anakId", "tanggal");

-- AddForeignKey
ALTER TABLE "daycare_orang_tua" ADD CONSTRAINT "daycare_orang_tua_anakId_fkey" FOREIGN KEY ("anakId") REFERENCES "daycare_anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daycare_pendaftaran" ADD CONSTRAINT "daycare_pendaftaran_anakId_fkey" FOREIGN KEY ("anakId") REFERENCES "daycare_anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daycare_pembayaran_pendaftaran" ADD CONSTRAINT "daycare_pembayaran_pendaftaran_pendaftaranId_fkey" FOREIGN KEY ("pendaftaranId") REFERENCES "daycare_pendaftaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daycare_tagihan_bulanan" ADD CONSTRAINT "daycare_tagihan_bulanan_anakId_fkey" FOREIGN KEY ("anakId") REFERENCES "daycare_anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daycare_pembayaran_bulanan" ADD CONSTRAINT "daycare_pembayaran_bulanan_tagihanId_fkey" FOREIGN KEY ("tagihanId") REFERENCES "daycare_tagihan_bulanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daycare_kehadiran_harian" ADD CONSTRAINT "daycare_kehadiran_harian_anakId_fkey" FOREIGN KEY ("anakId") REFERENCES "daycare_anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daycare_kehadiran_harian" ADD CONSTRAINT "daycare_kehadiran_harian_tagihanId_fkey" FOREIGN KEY ("tagihanId") REFERENCES "daycare_tagihan_harian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daycare_pembayaran_harian" ADD CONSTRAINT "daycare_pembayaran_harian_tagihanId_fkey" FOREIGN KEY ("tagihanId") REFERENCES "daycare_tagihan_harian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daycare_daily_report" ADD CONSTRAINT "daycare_daily_report_anakId_fkey" FOREIGN KEY ("anakId") REFERENCES "daycare_anak"("id") ON DELETE CASCADE ON UPDATE CASCADE;
