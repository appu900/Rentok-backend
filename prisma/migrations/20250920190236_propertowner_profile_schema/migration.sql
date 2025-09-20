/*
  Warnings:

  - You are about to drop the column `bankAccountNumber` on the `PropertyOwnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `bankIFSC` on the `PropertyOwnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `bankName` on the `PropertyOwnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `upiId` on the `PropertyOwnerProfile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."RoomSharingType" AS ENUM ('SINGLE', 'DOUBLE', 'TRIPLE', 'QUAD');

-- AlterTable
ALTER TABLE "public"."PropertyOwnerProfile" DROP COLUMN "bankAccountNumber",
DROP COLUMN "bankIFSC",
DROP COLUMN "bankName",
DROP COLUMN "upiId";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "whatsappNumber" TEXT;

-- CreateTable
CREATE TABLE "public"."Property" (
    "id" SERIAL NOT NULL,
    "propertyOwnerId" INTEGER NOT NULL,
    "propertyOwnerName" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "referralCode" TEXT,
    "ownerName" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "totalFloors" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Floor" (
    "id" SERIAL NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "whichFloor" INTEGER NOT NULL,
    "numberOfRooms" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Floor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Room" (
    "id" SERIAL NOT NULL,
    "floorId" INTEGER NOT NULL,
    "roomNumber" TEXT,
    "roomType" "public"."RoomSharingType" NOT NULL,
    "maxOccupancy" INTEGER,
    "currectOccupancy" INTEGER NOT NULL DEFAULT 0,
    "noOfBeds" INTEGER,
    "maintenanceCharge" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Floor_propertyId_idx" ON "public"."Floor"("propertyId");

-- CreateIndex
CREATE INDEX "Room_floorId_idx" ON "public"."Room"("floorId");

-- CreateIndex
CREATE INDEX "Room_isActive_currectOccupancy_idx" ON "public"."Room"("isActive", "currectOccupancy");

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_propertyOwnerId_fkey" FOREIGN KEY ("propertyOwnerId") REFERENCES "public"."PropertyOwnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Floor" ADD CONSTRAINT "Floor_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Room" ADD CONSTRAINT "Room_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "public"."Floor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
