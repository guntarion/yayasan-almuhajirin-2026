-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'pengurus';
ALTER TYPE "Role" ADD VALUE 'pengawas';
ALTER TYPE "Role" ADD VALUE 'pembina';
ALTER TYPE "Role" ADD VALUE 'kepalabidang';
ALTER TYPE "Role" ADD VALUE 'kepalaunit';
ALTER TYPE "Role" ADD VALUE 'operatorunit';
ALTER TYPE "Role" ADD VALUE 'sekretariat';
