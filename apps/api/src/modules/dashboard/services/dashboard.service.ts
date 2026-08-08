import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../../auth/repositories/user.repository";
import { CourseRepository } from "../../courses/repositories/course.repository";
import { CourseEnrollmentRepository } from "../../course-enrollment/repositories/course-enrollment.repository";
import {
  ConsultationRequestService,
  ConsultationRequestResponse,
} from "../../consultation-request/services/consultation-request.service";
import { BookingService, BookingResponse } from "../../booking/services/booking.service";
import { LessonService } from "../../lesson/services/lesson.service";
import { HomeworkService, HomeworkResponse } from "../../homework/services/homework.service";
import { MessageService, MessageResponse } from "../../message/services/message.service";
import { AuthenticatedUser } from "../../../auth/entities/authenticated-user.entity";
import {
  BookingType,
  ConsultationRequestStatus,
  HomeworkSubmissionStatus,
  LessonStatus,
  Role,
} from "../../../generated/prisma/client";

export interface StudentDashboardResponse {
  nextLiveClass: BookingResponse | null;
  enrolledCourses: { courseId: string; title: string; enrolledAt: Date }[];
  homework: {
    items: HomeworkResponse[];
    notSubmittedCount: number;
    submittedCount: number;
    reviewedCount: number;
  };
  latestMessages: MessageResponse[];
  upcomingBookings: BookingResponse[];
  progress: { completedLessons: number; homeworkCompleted: number };
}

export interface TeacherDashboardResponse {
  todaysSchedule: BookingResponse[];
  upcomingLiveClasses: BookingResponse[];
  recentStudentMessages: MessageResponse[];
  homeworkAwaitingReview: HomeworkResponse[];
  upcomingBookings: BookingResponse[];
}

export interface AdminDashboardResponse {
  totalStudents: number;
  activeStudents: number;
  todaysClasses: BookingResponse[];
  todaysConsultations: BookingResponse[];
  newConsultationRequests: ConsultationRequestResponse[];
  recentBookings: BookingResponse[];
  unreadMessagesCount: number;
}

const RECENT_LIMIT = 5;

@Injectable()
export class DashboardService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly courseRepository: CourseRepository,
    private readonly courseEnrollmentRepository: CourseEnrollmentRepository,
    private readonly consultationRequestService: ConsultationRequestService,
    private readonly bookingService: BookingService,
    private readonly lessonService: LessonService,
    private readonly homeworkService: HomeworkService,
    private readonly messageService: MessageService,
  ) {}

  async getStudentDashboard(
    currentUser: AuthenticatedUser,
  ): Promise<StudentDashboardResponse> {
    const now = new Date().toISOString();

    const [
      nextLiveClassPage,
      enrollments,
      notSubmitted,
      submitted,
      reviewed,
      recentHomework,
      latestMessages,
      upcomingBookings,
      completedLessons,
    ] = await Promise.all([
      this.bookingService.listBookings(
        { type: BookingType.LIVE_CLASS, from: now, order: "asc", page: 1, limit: 1 },
        currentUser,
      ),
      this.courseEnrollmentRepository.findMany({
        studentId: currentUser.id,
        skip: 0,
        take: 50,
      }),
      this.homeworkService.listHomework(
        { submissionStatus: HomeworkSubmissionStatus.NOT_SUBMITTED, page: 1, limit: 1 },
        currentUser,
      ),
      this.homeworkService.listHomework(
        { submissionStatus: HomeworkSubmissionStatus.SUBMITTED, page: 1, limit: 1 },
        currentUser,
      ),
      this.homeworkService.listHomework(
        { submissionStatus: HomeworkSubmissionStatus.REVIEWED, page: 1, limit: 1 },
        currentUser,
      ),
      this.homeworkService.listHomework(
        { page: 1, limit: RECENT_LIMIT },
        currentUser,
      ),
      this.messageService.listMessages({ page: 1, limit: RECENT_LIMIT }, currentUser),
      this.bookingService.listBookings(
        { from: now, order: "asc", page: 1, limit: RECENT_LIMIT },
        currentUser,
      ),
      this.lessonService.listLessons(
        { status: LessonStatus.COMPLETED, page: 1, limit: 1 },
        currentUser,
      ),
    ]);

    const enrolledCourses = await Promise.all(
      enrollments.items.map(async (enrollment) => {
        const course = await this.courseRepository.findById(
          enrollment.courseId,
        );
        return {
          courseId: enrollment.courseId,
          title: course?.title ?? "",
          enrolledAt: enrollment.enrolledAt,
        };
      }),
    );

    return {
      nextLiveClass: nextLiveClassPage.items[0] ?? null,
      enrolledCourses,
      homework: {
        items: recentHomework.items,
        notSubmittedCount: notSubmitted.total,
        submittedCount: submitted.total,
        reviewedCount: reviewed.total,
      },
      latestMessages: latestMessages.items,
      upcomingBookings: upcomingBookings.items,
      progress: {
        completedLessons: completedLessons.total,
        homeworkCompleted: submitted.total + reviewed.total,
      },
    };
  }

  async getTeacherDashboard(
    currentUser: AuthenticatedUser,
  ): Promise<TeacherDashboardResponse> {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const teacherId =
      currentUser.role === Role.TEACHER ? currentUser.id : undefined;

    const [
      todaysSchedule,
      upcomingLiveClasses,
      recentStudentMessages,
      homeworkAwaitingReview,
      upcomingBookings,
    ] = await Promise.all([
      this.bookingService.listBookings(
        {
          teacherId,
          from: startOfToday.toISOString(),
          to: endOfToday.toISOString(),
          order: "asc",
          page: 1,
          limit: 50,
        },
        currentUser,
      ),
      this.bookingService.listBookings(
        {
          teacherId,
          type: BookingType.LIVE_CLASS,
          from: now.toISOString(),
          order: "asc",
          page: 1,
          limit: RECENT_LIMIT,
        },
        currentUser,
      ),
      this.messageService.listMessages(
        { page: 1, limit: RECENT_LIMIT },
        currentUser,
      ),
      this.homeworkService.listHomework(
        {
          submissionStatus: HomeworkSubmissionStatus.SUBMITTED,
          page: 1,
          limit: RECENT_LIMIT,
        },
        currentUser,
      ),
      this.bookingService.listBookings(
        {
          teacherId,
          from: now.toISOString(),
          order: "asc",
          page: 1,
          limit: RECENT_LIMIT,
        },
        currentUser,
      ),
    ]);

    return {
      todaysSchedule: todaysSchedule.items,
      upcomingLiveClasses: upcomingLiveClasses.items,
      recentStudentMessages: recentStudentMessages.items,
      homeworkAwaitingReview: homeworkAwaitingReview.items,
      upcomingBookings: upcomingBookings.items,
    };
  }

  async getAdminDashboard(
    currentUser: AuthenticatedUser,
  ): Promise<AdminDashboardResponse> {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const [
      totalStudents,
      activeStudentsPage,
      todaysClasses,
      todaysConsultations,
      newConsultationRequests,
      recentBookings,
      unreadMessagesCount,
    ] = await Promise.all([
      this.userRepository.countByRole(Role.STUDENT),
      this.userRepository.findManyByRole({
        role: Role.STUDENT,
        skip: 0,
        take: 1,
      }),
      this.bookingService.listBookings(
        {
          type: BookingType.LIVE_CLASS,
          from: startOfToday.toISOString(),
          to: endOfToday.toISOString(),
          order: "asc",
          page: 1,
          limit: 50,
        },
        currentUser,
      ),
      this.bookingService.listBookings(
        {
          type: BookingType.FREE_CONSULTATION,
          from: startOfToday.toISOString(),
          to: endOfToday.toISOString(),
          order: "asc",
          page: 1,
          limit: 50,
        },
        currentUser,
      ),
      this.consultationRequestService.listRequests({
        status: ConsultationRequestStatus.PENDING,
        page: 1,
        limit: 10,
      }),
      this.bookingService.listBookings(
        { order: "desc", page: 1, limit: RECENT_LIMIT },
        currentUser,
      ),
      this.messageService.countUnread(),
    ]);

    return {
      totalStudents,
      activeStudents: activeStudentsPage.total,
      todaysClasses: todaysClasses.items,
      todaysConsultations: todaysConsultations.items,
      newConsultationRequests: newConsultationRequests.items,
      recentBookings: recentBookings.items,
      unreadMessagesCount,
    };
  }
}
