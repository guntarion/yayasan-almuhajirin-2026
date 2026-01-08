-- CreateEnum
CREATE TYPE "UkuranKaos" AS ENUM ('S', 'M', 'L', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "PreferensiAktivitas" AS ENUM ('FULL_LARI', 'LARI_JALAN', 'JALAN');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('belum_bayar', 'menunggu_konfirmasi', 'lunas', 'ditolak');

-- CreateTable
CREATE TABLE "run_madan_registrants" (
    "id" TEXT NOT NULL,
    "nomorRegistrasi" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nomorHP" TEXT NOT NULL,
    "email" TEXT,
    "alamat" TEXT NOT NULL,
    "statusPembayaran" "StatusPembayaran" NOT NULL DEFAULT 'belum_bayar',
    "tanggalBayar" TIMESTAMP(3),
    "buktiPembayaran" TEXT,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "run_madan_registrants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "run_madan_participants" (
    "id" TEXT NOT NULL,
    "registrantId" TEXT NOT NULL,
    "nomorBib" TEXT,
    "namaLengkap" TEXT NOT NULL,
    "jenisKelamin" "Gender" NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "ukuranKaos" "UkuranKaos" NOT NULL,
    "preferensiAktivitas" "PreferensiAktivitas" NOT NULL,
    "usia" INTEGER,
    "sudahAmbilRaceKit" BOOLEAN NOT NULL DEFAULT false,
    "sudahFinish" BOOLEAN NOT NULL DEFAULT false,
    "waktuFinish" TIMESTAMP(3),
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "run_madan_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "run_madan_registrants_nomorRegistrasi_key" ON "run_madan_registrants"("nomorRegistrasi");

-- CreateIndex
CREATE INDEX "run_madan_registrants_nomorHP_idx" ON "run_madan_registrants"("nomorHP");

-- CreateIndex
CREATE INDEX "run_madan_registrants_statusPembayaran_idx" ON "run_madan_registrants"("statusPembayaran");

-- CreateIndex
CREATE INDEX "run_madan_registrants_createdAt_idx" ON "run_madan_registrants"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "run_madan_participants_nomorBib_key" ON "run_madan_participants"("nomorBib");

-- CreateIndex
CREATE INDEX "run_madan_participants_registrantId_idx" ON "run_madan_participants"("registrantId");

-- CreateIndex
CREATE INDEX "run_madan_participants_namaLengkap_idx" ON "run_madan_participants"("namaLengkap");

-- CreateIndex
CREATE INDEX "run_madan_participants_nomorBib_idx" ON "run_madan_participants"("nomorBib");

-- AddForeignKey
ALTER TABLE "run_madan_participants" ADD CONSTRAINT "run_madan_participants_registrantId_fkey" FOREIGN KEY ("registrantId") REFERENCES "run_madan_registrants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
