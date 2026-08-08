import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { LessonRepository } from "../repositories/lesson.repository";
import { UserRepository } from "../../../auth/repositories/user.repository";
import { CourseRepository } from "../../courses/repositories/course.repository";
import { BookingRepository } from "../../booking/repositories/booking.repository";
import { CourseEnrollmentRepository } from "../../course-enrollment/repositories/course-enrollment.repository";
import { AuthenticatedUser } from "../../../auth/entities/authenticated-user.entity";
import { Lesson, LessonStatus, Role } from "../../../generated/prisma/client";
import { CreateLessonDto } from "../dto/create-lesson.dto";
import { UpdateLessonDto } from "../dto/update-lesson.dto";
import { ListLessonsQueryDto } from "../dto/list-lessons-query.dto";

export interface LessonResponse {
  id: string;
  title: string;
  studentId: string;
  teacherId: string;
  bookingId: string;
  courseId: string;
  lessonDate: Date;
  status: LessonStatus;
  createdAt: Date;
  updatedAt: Date;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_ENROLLMENT_LOOKUP = 1000;

@Injectable()
export class LessonService {
  constructor(
    private readonly lessonRepository: LessonRepository,
    private readonly userRepository: UserRepository,
    private readonly courseRepository: CourseRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly courseEnrollmentRepository: CourseEnrollmentRepository,
  ) {}

  async createLesson(dto: CreateLessonDto): Promise<LessonResponse> {
    const student = await this.userRepository.findById(dto.studentId);
    if (!student || student.role !== Role.STUDENT) {
      throw new NotFoundException("Student not found.");
    }

    const teacher = await this.userRepository.findById(dto.teacherId);
    if (!teacher || teacher.role !== Role.TEACHER) {
      throw new NotFoundException("Teacher not found.");
    }

    const course = await this.courseRepository.findById(dto.courseId);
    if (!course) {
      throw new NotFoundException("Course not found.");
    }

    const booking = await this.bookingRepository.findById(dto.bookingId);
    if (!booking) {
      throw new NotFoundException("Booking not found.");
    }

    const enrollment =
      await this.courseEnrollmentRepository.findByStudentAndCourse(
        dto.studentId,
        dto.courseId,
      );
    if (!enrollment || enrollment.deletedAt) {
      throw new NotFoundException(
        "Active course enrollment not found for this student and course.",
      );
    }

    const existingLesson = await this.lessonRepository.findByBookingId(
      dto.bookingId,
    );
    if (existingLesson) {
      throw new ConflictException(
        "A lesson already exists for this booking.",
      );
    }

    const lesson = await this.lessonRepository.create({
      title: dto.title,
      studentId: dto.studentId,
      teacherId: dto.teacherId,
      bookingId: dto.bookingId,
      courseId: dto.courseId,
      lessonDate: new Date(dto.lessonDate),
    });
    return toLessonResponse(lesson);
  }

  async listLessons(
    query: ListLessonsQueryDto,
    currentUser: AuthenticatedUser,
  ): Promise<{
    items: LessonResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    const studentId =
      currentUser.role === Role.STUDENT ? currentUser.id : query.studentId;

    const courseIdIn =
      currentUser.role === Role.STUDENT
        ? await this.findActiveEnrolledCourseIds(currentUser.id)
        : undefined;

    const { items, total } = await this.lessonRepository.findMany({
      skip: (page - 1) * limit,
      take: limit,
      studentId,
      teacherId: query.teacherId,
      courseId: currentUser.role === Role.STUDENT ? undefined : query.courseId,
      courseIdIn,
      status: query.status,
    });

    return {
      items: items.map(toLessonResponse),
      total,
      page,
      limit,
    };
  }

  async getLesson(
    id: string,
    currentUser: AuthenticatedUser,
  ): Promise<LessonResponse> {
    const lesson = await this.findLessonOrThrow(id);

    if (currentUser.role === Role.STUDENT) {
      if (lesson.studentId !== currentUser.id) {
        throw new ForbiddenException("You do not have access to this lesson.");
      }

      const enrollment =
        await this.courseEnrollmentRepository.findByStudentAndCourse(
          currentUser.id,
          lesson.courseId,
        );
      if (!enrollment || enrollment.deletedAt) {
        throw new ForbiddenException("You do not have access to this lesson.");
      }
    }

    return toLessonResponse(lesson);
  }

  async updateLesson(
    id: string,
    dto: UpdateLessonDto,
  ): Promise<LessonResponse> {
    await this.findLessonOrThrow(id);
    const updated = await this.lessonRepository.update(id, {
      title: dto.title,
      lessonDate: dto.lessonDate ? new Date(dto.lessonDate) : undefined,
      status: dto.status,
    });
    return toLessonResponse(updated);
  }

  private async findLessonOrThrow(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) {
      throw new NotFoundException("Lesson not found.");
    }
    return lesson;
  }

  private async findActiveEnrolledCourseIds(
    studentId: string,
  ): Promise<string[]> {
    const { items } = await this.courseEnrollmentRepository.findMany({
      skip: 0,
      take: MAX_ENROLLMENT_LOOKUP,
      studentId,
    });
    return items.map((enrollment) => enrollment.courseId);
  }
}

function toLessonResponse(lesson: Lesson): LessonResponse {
  return {
    id: lesson.id,
    title: lesson.title,
    studentId: lesson.studentId,
    teacherId: lesson.teacherId,
    bookingId: lesson.bookingId,
    courseId: lesson.courseId,
    lessonDate: lesson.lessonDate,
    status: lesson.status,
    createdAt: lesson.createdAt,
    updatedAt: lesson.updatedAt,
  };
}
