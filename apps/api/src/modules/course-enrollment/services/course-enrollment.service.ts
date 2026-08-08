import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CourseEnrollmentRepository } from "../repositories/course-enrollment.repository";
import { UserRepository } from "../../../auth/repositories/user.repository";
import { CourseRepository } from "../../courses/repositories/course.repository";
import {
  CourseEnrollment,
  Role,
} from "../../../generated/prisma/client";
import { CreateEnrollmentDto } from "../dto/create-enrollment.dto";
import { ListEnrollmentsQueryDto } from "../dto/list-enrollments-query.dto";

export interface EnrollmentResponse {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

@Injectable()
export class CourseEnrollmentService {
  constructor(
    private readonly courseEnrollmentRepository: CourseEnrollmentRepository,
    private readonly userRepository: UserRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async createEnrollment(
    dto: CreateEnrollmentDto,
  ): Promise<EnrollmentResponse> {
    const student = await this.userRepository.findById(dto.studentId);
    if (!student || student.role !== Role.STUDENT) {
      throw new NotFoundException("Student not found.");
    }

    const course = await this.courseRepository.findById(dto.courseId);
    if (!course) {
      throw new NotFoundException("Course not found.");
    }

    const existing = await this.courseEnrollmentRepository.findByStudentAndCourse(
      dto.studentId,
      dto.courseId,
    );

    if (existing) {
      if (!existing.deletedAt) {
        throw new ConflictException(
          "Student is already enrolled in this course.",
        );
      }
      const reactivated = await this.courseEnrollmentRepository.reactivate(
        existing.id,
      );
      return toEnrollmentResponse(reactivated);
    }

    const enrollment = await this.courseEnrollmentRepository.create(
      dto.studentId,
      dto.courseId,
    );
    return toEnrollmentResponse(enrollment);
  }

  async listEnrollments(query: ListEnrollmentsQueryDto): Promise<{
    items: EnrollmentResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    const { items, total } = await this.courseEnrollmentRepository.findMany({
      skip: (page - 1) * limit,
      take: limit,
      studentId: query.studentId,
      courseId: query.courseId,
    });

    return {
      items: items.map(toEnrollmentResponse),
      total,
      page,
      limit,
    };
  }

  async getEnrollment(id: string): Promise<EnrollmentResponse> {
    const enrollment = await this.findEnrollmentOrThrow(id);
    return toEnrollmentResponse(enrollment);
  }

  async withdrawEnrollment(id: string): Promise<void> {
    await this.findEnrollmentOrThrow(id);
    await this.courseEnrollmentRepository.softDelete(id);
  }

  async reactivateEnrollment(id: string): Promise<EnrollmentResponse> {
    await this.findEnrollmentOrThrow(id);
    const updated = await this.courseEnrollmentRepository.reactivate(id);
    return toEnrollmentResponse(updated);
  }

  private async findEnrollmentOrThrow(
    id: string,
  ): Promise<CourseEnrollment> {
    const enrollment = await this.courseEnrollmentRepository.findById(id);
    if (!enrollment) {
      throw new NotFoundException("Enrollment not found.");
    }
    return enrollment;
  }
}

function toEnrollmentResponse(
  enrollment: CourseEnrollment,
): EnrollmentResponse {
  return {
    id: enrollment.id,
    studentId: enrollment.studentId,
    courseId: enrollment.courseId,
    enrolledAt: enrollment.enrolledAt,
    createdAt: enrollment.createdAt,
    updatedAt: enrollment.updatedAt,
    deletedAt: enrollment.deletedAt,
  };
}
