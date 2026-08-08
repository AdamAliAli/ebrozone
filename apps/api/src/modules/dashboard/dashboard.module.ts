import { Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { CoursesModule } from "../courses/courses.module";
import { CourseEnrollmentModule } from "../course-enrollment/course-enrollment.module";
import { ConsultationRequestModule } from "../consultation-request/consultation-request.module";
import { BookingModule } from "../booking/booking.module";
import { LessonModule } from "../lesson/lesson.module";
import { HomeworkModule } from "../homework/homework.module";
import { MessageModule } from "../message/message.module";
import { DashboardController } from "./controllers/dashboard.controller";
import { DashboardService } from "./services/dashboard.service";

@Module({
  imports: [
    AuthModule,
    CoursesModule,
    CourseEnrollmentModule,
    ConsultationRequestModule,
    BookingModule,
    LessonModule,
    HomeworkModule,
    MessageModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
