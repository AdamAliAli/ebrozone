-- CreateEnum
CREATE TYPE "HomeworkSubmissionStatus" AS ENUM ('NOT_SUBMITTED', 'SUBMITTED', 'REVIEWED');

-- CreateTable
CREATE TABLE "homeworks" (
    "id" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "instructions" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "submissionStatus" "HomeworkSubmissionStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "teacherFeedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homeworks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "homeworks_lessonId_idx" ON "homeworks"("lessonId");

-- CreateIndex
CREATE INDEX "homeworks_submissionStatus_idx" ON "homeworks"("submissionStatus");

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
