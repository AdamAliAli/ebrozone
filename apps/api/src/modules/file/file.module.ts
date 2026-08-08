import { Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { CoursesModule } from "../courses/courses.module";
import { HomeworkModule } from "../homework/homework.module";
import { LessonModule } from "../lesson/lesson.module";
import { FileController } from "./controllers/file.controller";
import { FileService } from "./services/file.service";
import { FileRepository } from "./repositories/file.repository";

@Module({
  imports: [AuthModule, CoursesModule, HomeworkModule, LessonModule],
  controllers: [FileController],
  providers: [FileService, FileRepository],
})
export class FileModule {}
