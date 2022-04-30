-- CreateTable
CREATE TABLE `PlanDay` (
    `planId` INTEGER NOT NULL,
    `day` INTEGER NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`planId`, `day`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlanDay` ADD CONSTRAINT `PlanDay_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanDay` ADD CONSTRAINT `PlanDay_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`planId`) ON DELETE RESTRICT ON UPDATE CASCADE;
