import { Injectable, NotFoundException } from "@nestjs/common";
import { CourseRepository } from "../repositories/course.repository";
import { Course } from "../../../generated/prisma/client";
import { CreateCourseDto } from "../dto/create-course.dto";
import { UpdateCourseDto } from "../dto/update-course.dto";
import { ListCoursesQueryDto } from "../dto/list-courses-query.dto";

export interface CourseResponse {
  id: string;
  title: string;
  description: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

@Injectable()
export class CoursesService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async createCourse(dto: CreateCourseDto): Promise<CourseResponse> {
    const course = await this.courseRepository.create(
      dto.title,
      dto.description,
    );
    return toCourseResponse(course);
  }

  async listCourses(query: ListCoursesQueryDto): Promise<{
    items: CourseResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    const { items, total } = await this.courseRepository.findMany({
      skip: (page - 1) * limit,
      take: limit,
      search: query.search,
    });

    return {
      items: items.map(toCourseResponse),
      total,
      page,
      limit,
    };
  }

  async getCourse(id: string): Promise<CourseResponse> {
    const course = await this.findCourseOrThrow(id);
    return toCourseResponse(course);
  }

  async updateCourse(
    id: string,
    dto: UpdateCourseDto,
  ): Promise<CourseResponse> {
    await this.findCourseOrThrow(id);
    const updated = await this.courseRepository.updateDetails(id, {
      title: dto.title,
      description: dto.description,
    });
    return toCourseResponse(updated);
  }

  async deleteCourse(id: string): Promise<void> {
    await this.findCourseOrThrow(id);
    await this.courseRepository.softDelete(id);
  }

  async publishCourse(id: string): Promise<CourseResponse> {
    await this.findCourseOrThrow(id);
    const updated = await this.courseRepository.publish(id);
    return toCourseResponse(updated);
  }

  async unpublishCourse(id: string): Promise<CourseResponse> {
    await this.findCourseOrThrow(id);
    const updated = await this.courseRepository.unpublish(id);
    return toCourseResponse(updated);
  }

  private async findCourseOrThrow(id: string): Promise<Course> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException("Course not found.");
    }
    return course;
  }
}

function toCourseResponse(course: Course): CourseResponse {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    publishedAt: course.publishedAt,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    deletedAt: course.deletedAt,
  };
}
