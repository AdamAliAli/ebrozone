import { Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { CoursesController } from "./controllers/courses.controller";
import { CoursesService } from "./services/courses.service";
import { CourseRepository } from "./repositories/course.repository";

@Module({
  imports: [AuthModule],
  controllers: [CoursesController],
  providers: [CoursesService, CourseRepository],
  exports: [CourseRepository],
})
export class CoursesModule {}
