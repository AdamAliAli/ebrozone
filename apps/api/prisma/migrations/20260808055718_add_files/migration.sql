-- CreateEnum
CREATE TYPE "FileCategory" AS ENUM ('HOMEWORK', 'LESSON_RESOURCE', 'STUDENT_UPLOAD', 'COURSE_MATERIAL');

-- CreateEnum
CREATE TYPE "FileRelatedType" AS ENUM ('HOMEWORK', 'LESSON', 'COURSE');

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "uploaderId" UUID NOT NULL,
    "category" "FileCategory" NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "storedFilename" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "relatedType" "FileRelatedType",
    "relatedId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "files_cloudinaryPublicId_key" ON "files"("cloudinaryPublicId");

-- CreateIndex
CREATE INDEX "files_uploaderId_idx" ON "files"("uploaderId");

-- CreateIndex
CREATE INDEX "files_relatedType_relatedId_idx" ON "files"("relatedType", "relatedId");

-- CreateIndex
CREATE INDEX "files_category_idx" ON "files"("category");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
