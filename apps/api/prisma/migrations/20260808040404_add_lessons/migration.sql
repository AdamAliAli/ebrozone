-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "studentId" UUID NOT NULL,
    "teacherId" UUID NOT NULL,
    "bookingId" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "lessonDate" TIMESTAMP(3) NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lessons_bookingId_key" ON "lessons"("bookingId");

-- CreateIndex
CREATE INDEX "lessons_studentId_idx" ON "lessons"("studentId");

-- CreateIndex
CREATE INDEX "lessons_teacherId_idx" ON "lessons"("teacherId");

-- CreateIndex
CREATE INDEX "lessons_courseId_idx" ON "lessons"("courseId");

-- CreateIndex
CREATE INDEX "lessons_status_idx" ON "lessons"("status");

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
