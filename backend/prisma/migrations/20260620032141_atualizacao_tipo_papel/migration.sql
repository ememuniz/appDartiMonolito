/*
  Warnings:

  - The `papel` column on the `Convite` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `papel` column on the `Usuario` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Convite" DROP COLUMN "papel",
ADD COLUMN     "papel" TEXT NOT NULL DEFAULT 'EXTERNO';

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "papel",
ADD COLUMN     "papel" TEXT NOT NULL DEFAULT 'EXTERNO';

-- DropEnum
DROP TYPE "Papel";
