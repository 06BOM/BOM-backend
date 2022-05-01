/*
  Warnings:

  - Changed the type of `time` on the `plan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `plan` DROP COLUMN `time`,
    ADD COLUMN `time` TIME(0) NOT NULL;
