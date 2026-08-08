import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { HomeworkRepository } from "../repositories/homework.repository";
import { LessonRepository } from "../../lesson/repositories/lesson.repository";
import { CourseEnrollmentRepository } from "../../course-enrollment/repositories/course-enrollment.repository";
import { AuthenticatedUser } from "../../../auth/entities/authenticated-user.entity";
import {
  Homework,
  HomeworkSubmissionStatus,
  Role,
} from "../../../generated/prisma/client";
import { CreateHomeworkDto } from "../dto/create-homework.dto";
import { UpdateHomeworkDto } from "../dto/update-homework.dto";
import { ListHomeworkQueryDto } from "../dto/list-homework-query.dto";

export interface HomeworkResponse {
  id: string;
  lessonId: string;
  instructions: string;
  dueDate: Date;
  submissionStatus: HomeworkSubmissionStatus;
  teacherFeedback: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LOOKUP = 1000;

@Injectable()
export class HomeworkService {
  constructor(
    private readonly homeworkRepository: HomeworkRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly courseEnrollmentRepository: CourseEnrollmentRepository,
  ) {}

  async createHomework(dto: CreateHomeworkDto): Promise<HomeworkResponse> {
    const lesson = await this.lessonRepository.findById(dto.lessonId);
    if (!lesson) {
      throw new NotFoundException("Lesson not found.");
    }

    const homework = await this.homeworkRepository.create({
      lessonId: dto.lessonId,
      instructions: dto.instructions,
      dueDate: new Date(dto.dueDate),
    });
    return toHomeworkResponse(homework);
  }

  async listHomework(
    query: ListHomeworkQueryDto,
    currentUser: AuthenticatedUser,
  ): Promise<{
    items: HomeworkResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    let lessonId = query.lessonId;
    let lessonIdIn: string[] | undefined;

    if (currentUser.role === Role.STUDENT) {
      lessonId = undefined;
      lessonIdIn = await this.findAccessibleLessonIds(currentUser.id);
    }

    const { items, total } = await this.homeworkRepository.findMany({
      skip: (page - 1) * limit,
      take: limit,
      lessonId,
      lessonIdIn,
      submissionStatus: query.submissionStatus,
    });

    return {
      items: items.map(toHomeworkResponse),
      total,
      page,
      limit,
    };
  }

  async getHomework(
    id: string,
    currentUser: AuthenticatedUser,
  ): Promise<HomeworkResponse> {
    const homework = await this.findHomeworkWithLessonOrThrow(id);

    if (currentUser.role === Role.STUDENT) {
      await this.assertStudentCanAccessLesson(
        currentUser.id,
        homework.lesson.studentId,
        homework.lesson.courseId,
      );
    }

    return toHomeworkResponse(homework);
  }

  async updateHomework(
    id: string,
    dto: UpdateHomeworkDto,
  ): Promise<HomeworkResponse> {
    await this.findHomeworkOrThrow(id);
    const updated = await this.homeworkRepository.update(id, {
      instructions: dto.instructions,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      submissionStatus: dto.submissionStatus,
      teacherFeedback: dto.teacherFeedback,
    });
    return toHomeworkResponse(updated);
  }

  private async findHomeworkOrThrow(id: string): Promise<Homework> {
    const homework = await this.homeworkRepository.findById(id);
    if (!homework) {
      throw new NotFoundException("Homework not found.");
    }
    return homework;
  }

  private async findHomeworkWithLessonOrThrow(id: string) {
    const homework = await this.homeworkRepository.findByIdWithLesson(id);
    if (!homework) {
      throw new NotFoundException("Homework not found.");
    }
    return homework;
  }

  private async assertStudentCanAccessLesson(
    currentUserId: string,
    lessonStudentId: string,
    lessonCourseId: string,
  ): Promise<void> {
    if (lessonStudentId !== currentUserId) {
      throw new ForbiddenException("You do not have access to this homework.");
    }

    const enrollment =
      await this.courseEnrollmentRepository.findByStudentAndCourse(
        currentUserId,
        lessonCourseId,
      );
    if (!enrollment || enrollment.deletedAt) {
      throw new ForbiddenException("You do not have access to this homework.");
    }
  }

  private async findAccessibleLessonIds(studentId: string): Promise<string[]> {
    const { items: enrollments } =
      await this.courseEnrollmentRepository.findMany({
        skip: 0,
        take: MAX_LOOKUP,
        studentId,
      });
    const activeCourseIds = enrollments.map((enrollment) => enrollment.courseId);

    const { items: lessons } = await this.lessonRepository.findMany({
      skip: 0,
      take: MAX_LOOKUP,
      studentId,
      courseIdIn: activeCourseIds,
    });

    return lessons.map((lesson) => lesson.id);
  }
}

function toHomeworkResponse(homework: Homework): HomeworkResponse {
  return {
    id: homework.id,
    lessonId: homework.lessonId,
    instructions: homework.instructions,
    dueDate: homework.dueDate,
    submissionStatus: homework.submissionStatus,
    teacherFeedback: homework.teacherFeedback,
    createdAt: homework.createdAt,
    updatedAt: homework.updatedAt,
  };
}
