-- CreateEnum
CREATE TYPE "MinatKomunitasSehat" AS ENUM ('SENAM_SEHAT', 'SENAM_AQUATIK_LANSIA', 'LINE_DANCE', 'POUND_FITNESS');

-- CreateEnum
CREATE TYPE "KondisiKesehatan" AS ENUM ('HIPERTENSI', 'DIABETES', 'ASAM_URAT', 'KOLESTEROL', 'JANTUNG', 'ASMA', 'STROKE', 'NYERI_SENDI', 'OSTEOPOROSIS', 'VERTIGO', 'LAINNYA', 'TIDAK_ADA');

-- CreateTable
CREATE TABLE "senam_registrants" (
    "id" TEXT NOT NULL,
    "nomorRegistrasi" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nomorHP" TEXT NOT NULL,
    "email" TEXT,
    "alamat" TEXT NOT NULL,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "senam_registrants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "senam_participants" (
    "id" TEXT NOT NULL,
    "registrantId" TEXT NOT NULL,
    "nomorKupon" TEXT,
    "namaLengkap" TEXT NOT NULL,
    "jenisKelamin" "Gender" NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "usia" INTEGER,
    "kondisiKesehatan" TEXT NOT NULL,
    "kondisiLainnya" TEXT,
    "minatKomunitas" TEXT NOT NULL,
    "sudahHadir" BOOLEAN NOT NULL DEFAULT false,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "senam_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "senam_registrants_nomorRegistrasi_key" ON "senam_registrants"("nomorRegistrasi");

-- CreateIndex
CREATE INDEX "senam_registrants_nomorHP_idx" ON "senam_registrants"("nomorHP");

-- CreateIndex
CREATE INDEX "senam_registrants_createdAt_idx" ON "senam_registrants"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "senam_participants_nomorKupon_key" ON "senam_participants"("nomorKupon");

-- CreateIndex
CREATE INDEX "senam_participants_registrantId_idx" ON "senam_participants"("registrantId");

-- CreateIndex
CREATE INDEX "senam_participants_namaLengkap_idx" ON "senam_participants"("namaLengkap");

-- CreateIndex
CREATE INDEX "senam_participants_nomorKupon_idx" ON "senam_participants"("nomorKupon");

-- AddForeignKey
ALTER TABLE "senam_participants" ADD CONSTRAINT "senam_participants_registrantId_fkey" FOREIGN KEY ("registrantId") REFERENCES "senam_registrants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
