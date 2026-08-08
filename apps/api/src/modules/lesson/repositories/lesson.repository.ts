import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { LessonStatus, Prisma } from "../../../generated/prisma/client";

@Injectable()
export class LessonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: {
      title: string;
      studentId: string;
      teacherId: string;
      bookingId: string;
      courseId: string;
      lessonDate: Date;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.lesson.create({ data });
  }

  async findById(id: string) {
    return this.prisma.lesson.findUnique({ where: { id } });
  }

  async findByBookingId(bookingId: string) {
    return this.prisma.lesson.findUnique({ where: { bookingId } });
  }

  async findMany(params: {
    skip: number;
    take: number;
    studentId?: string;
    teacherId?: string;
    courseId?: string;
    courseIdIn?: string[];
    status?: LessonStatus;
  }) {
    const where: Prisma.LessonWhereInput = {
      ...(params.studentId ? { studentId: params.studentId } : {}),
      ...(params.teacherId ? { teacherId: params.teacherId } : {}),
      ...(params.courseId ? { courseId: params.courseId } : {}),
      ...(params.courseIdIn ? { courseId: { in: params.courseIdIn } } : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.lesson.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { lessonDate: "desc" },
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return { items, total };
  }

  async update(
    id: string,
    data: Prisma.LessonUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.lesson.update({ where: { id }, data });
  }
}
