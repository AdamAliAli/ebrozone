import { Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { CoursesModule } from "../courses/courses.module";
import { BookingModule } from "../booking/booking.module";
import { CourseEnrollmentModule } from "../course-enrollment/course-enrollment.module";
import { LessonController } from "./controllers/lesson.controller";
import { LessonService } from "./services/lesson.service";
import { LessonRepository } from "./repositories/lesson.repository";

@Module({
  imports: [AuthModule, CoursesModule, BookingModule, CourseEnrollmentModule],
  controllers: [LessonController],
  providers: [LessonService, LessonRepository],
  exports: [LessonRepository],
})
export class LessonModule {}
