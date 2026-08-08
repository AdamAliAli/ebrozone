import { Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { LessonModule } from "../lesson/lesson.module";
import { CourseEnrollmentModule } from "../course-enrollment/course-enrollment.module";
import { HomeworkController } from "./controllers/homework.controller";
import { HomeworkService } from "./services/homework.service";
import { HomeworkRepository } from "./repositories/homework.repository";

@Module({
  imports: [AuthModule, LessonModule, CourseEnrollmentModule],
  controllers: [HomeworkController],
  providers: [HomeworkService, HomeworkRepository],
})
export class HomeworkModule {}
