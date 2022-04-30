/*
  Warnings:

  - Added the required column `planName` to the `PlanDay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `planday` ADD COLUMN `planName` VARCHAR(45) NOT NULL;
