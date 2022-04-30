/*
  Warnings:

  - The primary key for the `like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `communityId` on the `like` table. All the data in the column will be lost.
  - The primary key for the `scrap` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `communityId` on the `scrap` table. All the data in the column will be lost.
  - Added the required column `postId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Scrap` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_userId_fkey`;

-- DropForeignKey
ALTER TABLE `collection` DROP FOREIGN KEY `Collection_userId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `daily` DROP FOREIGN KEY `Daily_userId_fkey`;

-- DropForeignKey
ALTER TABLE `follower` DROP FOREIGN KEY `Follower_fromId_fkey`;

-- DropForeignKey
ALTER TABLE `follower` DROP FOREIGN KEY `Follower_toId_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `Like_communityId_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `Like_userId_fkey`;

-- DropForeignKey
ALTER TABLE `postcontenturl` DROP FOREIGN KEY `PostContentUrl_postId_fkey`;

-- DropForeignKey
ALTER TABLE `questattempt` DROP FOREIGN KEY `QuestAttempt_userId_fkey`;

-- DropForeignKey
ALTER TABLE `scrap` DROP FOREIGN KEY `Scrap_communityId_fkey`;

-- DropForeignKey
ALTER TABLE `scrap` DROP FOREIGN KEY `Scrap_userId_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- AlterTable
ALTER TABLE `category` MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `like` DROP PRIMARY KEY,
    DROP COLUMN `communityId`,
    ADD COLUMN `postId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`postId`, `userId`);

-- AlterTable
ALTER TABLE `scrap` DROP PRIMARY KEY,
    DROP COLUMN `communityId`,
    ADD COLUMN `postId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`postId`, `userId`);

-- AddForeignKey
ALTER TABLE `Daily` ADD CONSTRAINT `Daily_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestAttempt` ADD CONSTRAINT `QuestAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follower` ADD CONSTRAINT `Follower_fromId_fkey` FOREIGN KEY (`fromId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follower` ADD CONSTRAINT `Follower_toId_fkey` FOREIGN KEY (`toId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostContentUrl` ADD CONSTRAINT `PostContentUrl_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`postId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`postId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`postId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scrap` ADD CONSTRAINT `Scrap_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scrap` ADD CONSTRAINT `Scrap_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`postId`) ON DELETE CASCADE ON UPDATE CASCADE;
