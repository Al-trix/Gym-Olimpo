-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_updatedById_fkey";

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "updatedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
