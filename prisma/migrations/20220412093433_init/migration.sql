/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `OXUnitRange` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reportId]` on the table `ReportLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `OXUnitRange_roomId_key` ON `OXUnitRange`(`roomId`);

-- CreateIndex
CREATE UNIQUE INDEX `ReportLog_reportId_key` ON `ReportLog`(`reportId`);
