// Mirrors NestJS response shapes (apps/api/src/modules/**/services/*.ts).
// The frontend can't import backend types directly (separate app) — these
// must be kept in sync by hand when the backend DTOs change.
//
// Dates cross the wire as JSON, so every Date field here is a `string`
// (ISO 8601), not a `Date` — that's what the client actually receives.

export type BookingType = "FREE_CONSULTATION" | "LIVE_CLASS";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED";

export type HomeworkSubmissionStatus =
  | "NOT_SUBMITTED"
  | "SUBMITTED"
  | "REVIEWED";

export type ConsultationRequestStatus =
  | "PENDING"
  | "CONTACTED"
  | "CONVERTED"
  | "DECLINED";

// apps/api/src/modules/booking/services/booking.service.ts — BookingResponse
export interface BookingResponse {
  id: string;
  studentId: string;
  teacherId: string;
  type: BookingType;
  scheduledAt: string;
  status: BookingStatus;
  meetingLink: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// apps/api/src/modules/homework/services/homework.service.ts — HomeworkResponse
export interface HomeworkResponse {
  id: string;
  lessonId: string;
  instructions: string;
  dueDate: string;
  submissionStatus: HomeworkSubmissionStatus;
  teacherFeedback: string | null;
  createdAt: string;
  updatedAt: string;
}

// apps/api/src/modules/message/services/message.service.ts — MessageResponse
export interface MessageResponse {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnrolledCourseSummary {
  courseId: string;
  title: string;
  enrolledAt: string;
}

// apps/api/src/modules/consultation-request/services/consultation-request.service.ts — ConsultationRequestResponse
export interface ConsultationRequestResponse {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  preferredContactTime: string | null;
  currentEnglishLevel: string | null;
  learningGoal: string | null;
  notes: string | null;
  status: ConsultationRequestStatus;
  createdAt: string;
  updatedAt: string;
}

// apps/api/src/modules/dashboard/services/dashboard.service.ts — StudentDashboardResponse
export interface StudentDashboardResponse {
  nextLiveClass: BookingResponse | null;
  enrolledCourses: EnrolledCourseSummary[];
  homework: {
    items: HomeworkResponse[];
    notSubmittedCount: number;
    submittedCount: number;
    reviewedCount: number;
  };
  latestMessages: MessageResponse[];
  upcomingBookings: BookingResponse[];
  progress: {
    completedLessons: number;
    homeworkCompleted: number;
  };
}

// apps/api/src/modules/dashboard/services/dashboard.service.ts — TeacherDashboardResponse
export interface TeacherDashboardResponse {
  todaysSchedule: BookingResponse[];
  upcomingLiveClasses: BookingResponse[];
  recentStudentMessages: MessageResponse[];
  homeworkAwaitingReview: HomeworkResponse[];
  upcomingBookings: BookingResponse[];
}

// apps/api/src/modules/dashboard/services/dashboard.service.ts — AdminDashboardResponse
export interface AdminDashboardResponse {
  totalStudents: number;
  activeStudents: number;
  todaysClasses: BookingResponse[];
  todaysConsultations: BookingResponse[];
  newConsultationRequests: ConsultationRequestResponse[];
  recentBookings: BookingResponse[];
  unreadMessagesCount: number;
}
