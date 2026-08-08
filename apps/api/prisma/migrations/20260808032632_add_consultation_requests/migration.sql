-- CreateEnum
CREATE TYPE "ConsultationRequestStatus" AS ENUM ('PENDING', 'CONTACTED', 'CONVERTED', 'DECLINED');

-- CreateTable
CREATE TABLE "consultation_requests" (
    "id" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "preferredContactTime" TEXT,
    "currentEnglishLevel" TEXT,
    "learningGoal" TEXT,
    "notes" TEXT,
    "status" "ConsultationRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "consultation_requests_status_idx" ON "consultation_requests"("status");
