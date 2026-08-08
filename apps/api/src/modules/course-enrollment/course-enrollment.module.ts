import { Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { CoursesModule } from "../courses/courses.module";
import { CourseEnrollmentController } from "./controllers/course-enrollment.controller";
import { CourseEnrollmentService } from "./services/course-enrollment.service";
import { CourseEnrollmentRepository } from "./repositories/course-enrollment.repository";

@Module({
  imports: [AuthModule, CoursesModule],
  controllers: [CourseEnrollmentController],
  providers: [CourseEnrollmentService, CourseEnrollmentRepository],
  exports: [CourseEnrollmentRepository],
})
export class CourseEnrollmentModule {}
