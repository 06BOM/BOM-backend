-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `emailId` VARCHAR(45) NOT NULL,
    `userName` VARCHAR(45) NOT NULL,
    `password` VARCHAR(45) NOT NULL,
    `nickname` VARCHAR(45) NOT NULL,
    `birth` DATETIME(3) NOT NULL,
    `phoneNum` VARCHAR(45) NOT NULL,
    `grade` INTEGER NOT NULL,
    `star` INTEGER NOT NULL DEFAULT 0,
    `timeItem` INTEGER NOT NULL DEFAULT 0,
    `passItem` INTEGER NOT NULL DEFAULT 0,
    `introduction` VARCHAR(191) NULL,
    `platform` VARCHAR(191) NULL,
    `platformId` VARCHAR(255) NULL,
    `lock` BOOLEAN NOT NULL DEFAULT false,
    `lockFreeDate` DATETIME(3) NULL,
    `userType` INTEGER NOT NULL DEFAULT 0,
    `characterId` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_emailId_key`(`emailId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Daily` (
    `dailyId` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `obtainedStar` INTEGER NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`dailyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `categoryId` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(45) NOT NULL,
    `color` VARCHAR(45) NOT NULL,
    `type` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plan` (
    `planId` INTEGER NOT NULL AUTO_INCREMENT,
    `planName` VARCHAR(45) NOT NULL,
    `time` INTEGER NOT NULL DEFAULT 0,
    `check` BOOLEAN NOT NULL DEFAULT false,
    `repetitionType` INTEGER NULL,
    `dailyId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`planId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `messageId` INTEGER NOT NULL AUTO_INCREMENT,
    `sendDate` DATETIME(3) NOT NULL,
    `contents` VARCHAR(45) NOT NULL,
    `readCheck` BOOLEAN NOT NULL DEFAULT false,
    `recvId` INTEGER NOT NULL,
    `sentId` INTEGER NOT NULL,

    PRIMARY KEY (`messageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `sessionId` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`sessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `reportId` INTEGER NOT NULL AUTO_INCREMENT,
    `contents` VARCHAR(191) NULL,
    `reportType` INTEGER NOT NULL,
    `accept` BOOLEAN NOT NULL DEFAULT false,
    `reportUser` INTEGER NOT NULL,
    `reportedUser` INTEGER NOT NULL,
    `reportedPost` INTEGER NULL,

    PRIMARY KEY (`reportId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReportLog` (
    `reportLogId` INTEGER NOT NULL AUTO_INCREMENT,
    `disciplinaryAction` INTEGER NOT NULL DEFAULT 0,
    `reportId` INTEGER NOT NULL,
    `adminId` INTEGER NOT NULL,

    PRIMARY KEY (`reportLogId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Character` (
    `characterId` INTEGER NOT NULL AUTO_INCREMENT,
    `characterName` VARCHAR(45) NOT NULL,
    `star` INTEGER NOT NULL,
    `imageUrl` TEXT NOT NULL,
    `silhouetteUrl` TEXT NOT NULL,
    `introduction` TEXT NOT NULL,
    `explanation` TEXT NOT NULL,
    `brain` INTEGER NOT NULL,
    `speed` INTEGER NOT NULL,
    `power` INTEGER NOT NULL,
    `teq` INTEGER NOT NULL,
    `strength` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `mbti` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`characterId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MockDB` (
    `mockquestionId` INTEGER NOT NULL AUTO_INCREMENT,
    `grade` INTEGER NOT NULL,
    `subject` VARCHAR(45) NOT NULL,
    `questionImage` TEXT NOT NULL,
    `answer` VARCHAR(45) NOT NULL,
    `explanation` TEXT NOT NULL,
    `provisionCheck` BOOLEAN NOT NULL DEFAULT false,
    `totalNumSolved` INTEGER NOT NULL DEFAULT 0,
    `correctNum` INTEGER NOT NULL DEFAULT 0,
    `provider` INTEGER NOT NULL,

    PRIMARY KEY (`mockquestionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OXDB` (
    `oxquestionId` INTEGER NOT NULL AUTO_INCREMENT,
    `oxquestion` VARCHAR(45) NOT NULL,
    `oxanswer` VARCHAR(45) NOT NULL,
    `subject` VARCHAR(45) NOT NULL,
    `grade` INTEGER NOT NULL,
    `range` INTEGER NOT NULL,
    `totalNumSolved` INTEGER NOT NULL DEFAULT 0,
    `correctNum` INTEGER NOT NULL DEFAULT 0,
    `provider` INTEGER NOT NULL,

    PRIMARY KEY (`oxquestionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SketchDB` (
    `sketchquestionId` INTEGER NOT NULL AUTO_INCREMENT,
    `sketchword` VARCHAR(45) NOT NULL,
    `subject` VARCHAR(45) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`sketchquestionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `roomId` INTEGER NOT NULL AUTO_INCREMENT,
    `roomName` VARCHAR(45) NOT NULL,
    `kind` INTEGER NOT NULL,
    `participantsNum` INTEGER NOT NULL,
    `secretMode` BOOLEAN NOT NULL DEFAULT false,
    `password` VARCHAR(45) NULL,
    `subject` VARCHAR(45) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestAttempt` (
    `questionId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`questionId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Follower` (
    `fromId` INTEGER NOT NULL,
    `toId` INTEGER NOT NULL,
    `permission` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`fromId`, `toId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `postId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(45) NOT NULL,
    `content` VARCHAR(150) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `postKind` INTEGER NOT NULL,
    `anonymous` BOOLEAN NOT NULL DEFAULT false,
    `categoryId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`postId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostContentUrl` (
    `contentId` INTEGER NOT NULL AUTO_INCREMENT,
    `contentUrl` TEXT NOT NULL,
    `postId` INTEGER NOT NULL,

    PRIMARY KEY (`contentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `commentId` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `commentParent` INTEGER NULL,
    `postId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`commentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OXUnitRange` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unit` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collection` (
    `userId` INTEGER NOT NULL,
    `characterId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `characterId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Like` (
    `communityId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`communityId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Scrap` (
    `communityId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`communityId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`characterId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Daily` ADD CONSTRAINT `Daily_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plan` ADD CONSTRAINT `Plan_dailyId_fkey` FOREIGN KEY (`dailyId`) REFERENCES `Daily`(`dailyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plan` ADD CONSTRAINT `Plan_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`categoryId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_recvId_fkey` FOREIGN KEY (`recvId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_sentId_fkey` FOREIGN KEY (`sentId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reportUser_fkey` FOREIGN KEY (`reportUser`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reportedUser_fkey` FOREIGN KEY (`reportedUser`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reportedPost_fkey` FOREIGN KEY (`reportedPost`) REFERENCES `Post`(`postId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReportLog` ADD CONSTRAINT `ReportLog_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReportLog` ADD CONSTRAINT `ReportLog_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `Report`(`reportId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MockDB` ADD CONSTRAINT `MockDB_provider_fkey` FOREIGN KEY (`provider`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OXDB` ADD CONSTRAINT `OXDB_provider_fkey` FOREIGN KEY (`provider`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestAttempt` ADD CONSTRAINT `QuestAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestAttempt` ADD CONSTRAINT `QuestAttempt_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `MockDB`(`mockquestionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follower` ADD CONSTRAINT `Follower_fromId_fkey` FOREIGN KEY (`fromId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follower` ADD CONSTRAINT `Follower_toId_fkey` FOREIGN KEY (`toId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`categoryId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostContentUrl` ADD CONSTRAINT `PostContentUrl_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`postId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`postId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OXUnitRange` ADD CONSTRAINT `OXUnitRange_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`roomId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`characterId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_communityId_fkey` FOREIGN KEY (`communityId`) REFERENCES `Post`(`postId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scrap` ADD CONSTRAINT `Scrap_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scrap` ADD CONSTRAINT `Scrap_communityId_fkey` FOREIGN KEY (`communityId`) REFERENCES `Post`(`postId`) ON DELETE RESTRICT ON UPDATE CASCADE;
