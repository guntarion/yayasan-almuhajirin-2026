-- CreateEnum
CREATE TYPE "KbtkKelompokLevel" AS ENUM ('KB', 'TK');

-- CreateEnum
CREATE TYPE "KbtkKelompokKelas" AS ENUM ('A', 'B');

-- CreateEnum
CREATE TYPE "KbtkStatusSiswa" AS ENUM ('aktif', 'cuti', 'lulus', 'keluar');

-- CreateEnum
CREATE TYPE "KbtkStatusPendaftaran" AS ENUM ('daftar', 'diterima', 'batal');

-- CreateEnum
CREATE TYPE "KbtkSchemaPembayaran" AS ENUM ('lunas', 'angsuran');

-- CreateEnum
CREATE TYPE "KbtkStatusTagihan" AS ENUM ('belum_bayar', 'bayar_sebagian', 'lunas');

-- CreateEnum
CREATE TYPE "KbtkMetodePembayaran" AS ENUM ('cash', 'transfer');

-- CreateEnum
CREATE TYPE "KbtkRelasi" AS ENUM ('ayah', 'ibu', 'wali');

-- CreateTable
CREATE TABLE "kbtk_siswa" (
    "id" TEXT NOT NULL,
    "nomorInduk" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "namaPanggilan" TEXT,
    "jenisKelamin" "Gender" NOT NULL,
    "tanggalLahir" TIMESTAMP(3),
    "tempatLahir" TEXT,
    "foto" TEXT,
    "kelompokLevel" "KbtkKelompokLevel" NOT NULL,
    "kelompokKelas" "KbtkKelompokKelas" NOT NULL DEFAULT 'A',
    "tahunAjaran" TEXT NOT NULL,
    "tanggalMasuk" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "KbtkStatusSiswa" NOT NULL DEFAULT 'aktif',
    "alamat" TEXT,
    "catatanKhusus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kbtk_siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kbtk_orang_tua" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "relasi" "KbtkRelasi" NOT NULL,
    "nomorHP" TEXT,
    "email" TEXT,
    "pekerjaan" TEXT,
    "alamat" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kbtk_orang_tua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kbtk_pendaftaran" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "tanggalDaftar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "program" "KbtkKelompokLevel" NOT NULL,
    "biayaPendaftaran" DECIMAL(15,2) NOT NULL,
    "schemaPembayaran" "KbtkSchemaPembayaran" NOT NULL DEFAULT 'lunas',
    "status" "KbtkStatusPendaftaran" NOT NULL DEFAULT 'daftar',
    "tanggalDiterima" TIMESTAMP(3),
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kbtk_pendaftaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kbtk_pembayaran_pendaftaran" (
    "id" TEXT NOT NULL,
    "pendaftaranId" TEXT NOT NULL,
    "tanggalBayar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nominal" DECIMAL(15,2) NOT NULL,
    "metodePembayaran" "KbtkMetodePembayaran" NOT NULL DEFAULT 'cash',
    "buktiTransfer" TEXT,
    "catatan" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kbtk_pembayaran_pendaftaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kbtk_setting_spp" (
    "id" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "kelompokLevel" "KbtkKelompokLevel" NOT NULL,
    "nominalSpp" DECIMAL(15,2) NOT NULL,
    "keterangan" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kbtk_setting_spp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kbtk_tagihan_spp" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "nominal" DECIMAL(15,2) NOT NULL,
    "diskon" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalTagihan" DECIMAL(15,2) NOT NULL,
    "status" "KbtkStatusTagihan" NOT NULL DEFAULT 'belum_bayar',
    "tanggalJatuhTempo" TIMESTAMP(3),
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kbtk_tagihan_spp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kbtk_pembayaran_spp" (
    "id" TEXT NOT NULL,
    "tagihanId" TEXT NOT NULL,
    "tanggalBayar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nominal" DECIMAL(15,2) NOT NULL,
    "metodePembayaran" "KbtkMetodePembayaran" NOT NULL DEFAULT 'cash',
    "buktiTransfer" TEXT,
    "catatan" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kbtk_pembayaran_spp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kbtk_siswa_nomorInduk_key" ON "kbtk_siswa"("nomorInduk");

-- CreateIndex
CREATE INDEX "kbtk_siswa_kelompokLevel_idx" ON "kbtk_siswa"("kelompokLevel");

-- CreateIndex
CREATE INDEX "kbtk_siswa_kelompokKelas_idx" ON "kbtk_siswa"("kelompokKelas");

-- CreateIndex
CREATE INDEX "kbtk_siswa_tahunAjaran_idx" ON "kbtk_siswa"("tahunAjaran");

-- CreateIndex
CREATE INDEX "kbtk_siswa_status_idx" ON "kbtk_siswa"("status");

-- CreateIndex
CREATE INDEX "kbtk_siswa_namaLengkap_idx" ON "kbtk_siswa"("namaLengkap");

-- CreateIndex
CREATE INDEX "kbtk_orang_tua_siswaId_idx" ON "kbtk_orang_tua"("siswaId");

-- CreateIndex
CREATE INDEX "kbtk_orang_tua_isPrimary_idx" ON "kbtk_orang_tua"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "kbtk_pendaftaran_siswaId_key" ON "kbtk_pendaftaran"("siswaId");

-- CreateIndex
CREATE INDEX "kbtk_pendaftaran_tahunAjaran_idx" ON "kbtk_pendaftaran"("tahunAjaran");

-- CreateIndex
CREATE INDEX "kbtk_pendaftaran_status_idx" ON "kbtk_pendaftaran"("status");

-- CreateIndex
CREATE INDEX "kbtk_pembayaran_pendaftaran_pendaftaranId_idx" ON "kbtk_pembayaran_pendaftaran"("pendaftaranId");

-- CreateIndex
CREATE INDEX "kbtk_pembayaran_pendaftaran_tanggalBayar_idx" ON "kbtk_pembayaran_pendaftaran"("tanggalBayar");

-- CreateIndex
CREATE INDEX "kbtk_setting_spp_isActive_idx" ON "kbtk_setting_spp"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "kbtk_setting_spp_tahunAjaran_kelompokLevel_key" ON "kbtk_setting_spp"("tahunAjaran", "kelompokLevel");

-- CreateIndex
CREATE INDEX "kbtk_tagihan_spp_status_idx" ON "kbtk_tagihan_spp"("status");

-- CreateIndex
CREATE INDEX "kbtk_tagihan_spp_bulan_tahun_idx" ON "kbtk_tagihan_spp"("bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "kbtk_tagihan_spp_siswaId_bulan_tahun_key" ON "kbtk_tagihan_spp"("siswaId", "bulan", "tahun");

-- CreateIndex
CREATE INDEX "kbtk_pembayaran_spp_tagihanId_idx" ON "kbtk_pembayaran_spp"("tagihanId");

-- CreateIndex
CREATE INDEX "kbtk_pembayaran_spp_tanggalBayar_idx" ON "kbtk_pembayaran_spp"("tanggalBayar");

-- AddForeignKey
ALTER TABLE "kbtk_orang_tua" ADD CONSTRAINT "kbtk_orang_tua_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "kbtk_siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kbtk_pendaftaran" ADD CONSTRAINT "kbtk_pendaftaran_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "kbtk_siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kbtk_pembayaran_pendaftaran" ADD CONSTRAINT "kbtk_pembayaran_pendaftaran_pendaftaranId_fkey" FOREIGN KEY ("pendaftaranId") REFERENCES "kbtk_pendaftaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kbtk_tagihan_spp" ADD CONSTRAINT "kbtk_tagihan_spp_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "kbtk_siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kbtk_pembayaran_spp" ADD CONSTRAINT "kbtk_pembayaran_spp_tagihanId_fkey" FOREIGN KEY ("tagihanId") REFERENCES "kbtk_tagihan_spp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
