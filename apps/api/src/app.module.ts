import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import envConfig from "./config/env";
import { PrismaModule } from "./prisma/prisma.module";
import { EmailModule } from "./email/email.module";
import { AuthModule } from "./auth/auth.module";
import { EnrollmentModule } from "./modules/enrollment/enrollment.module";
import { CoursesModule } from "./modules/courses/courses.module";
import { CourseEnrollmentModule } from "./modules/course-enrollment/course-enrollment.module";
import { ConsultationRequestModule } from "./modules/consultation-request/consultation-request.module";
import { BookingModule } from "./modules/booking/booking.module";
import { LessonModule } from "./modules/lesson/lesson.module";
import { HomeworkModule } from "./modules/homework/homework.module";
import { MessageModule } from "./modules/message/message.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    PrismaModule,
    EmailModule,
    AuthModule,
    EnrollmentModule,
    CoursesModule,
    CourseEnrollmentModule,
    ConsultationRequestModule,
    BookingModule,
    LessonModule,
    HomeworkModule,
    MessageModule,
    DashboardModule,
  ],
})
export class AppModule {}
