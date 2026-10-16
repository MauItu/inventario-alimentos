-- CreateEnum
CREATE TYPE "Category" AS ENUM ('lacteos', 'frutas', 'vegetales', 'carnes');

-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('perecedero', 'no perecedero');

-- CreateEnum
CREATE TYPE "MeasureUnit" AS ENUM ('unidades', 'kilos', 'libras');

-- AlterTable: los textos existentes se convierten a enum; falla si hay un valor fuera de la lista
ALTER TABLE "Food"
ALTER COLUMN "category" SET DATA TYPE "Category" USING "category"::"Category",
ALTER COLUMN "typeFood" SET DATA TYPE "FoodType" USING "typeFood"::"FoodType",
ALTER COLUMN "typeMeasure" SET DATA TYPE "MeasureUnit" USING "typeMeasure"::"MeasureUnit",
ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable: las filas existentes toman la fecha de la migración
ALTER TABLE "User"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

ALTER TABLE "Food"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Food" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable: la relación pasa de User.email a User.id
ALTER TABLE "Food" ADD COLUMN "userId" TEXT;

UPDATE "Food" AS f
SET "userId" = u."id"
FROM "User" AS u
WHERE u."email" = f."email";

ALTER TABLE "Food" ALTER COLUMN "userId" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_email_fkey";

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "email";

-- CreateIndex
CREATE INDEX "Food_userId_idx" ON "Food"("userId");

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
