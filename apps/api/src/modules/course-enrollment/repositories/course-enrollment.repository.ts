import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Prisma } from "../../../generated/prisma/client";

@Injectable()
export class CourseEnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    studentId: string,
    courseId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.courseEnrollment.create({ data: { studentId, courseId } });
  }

  async findById(id: string) {
    return this.prisma.courseEnrollment.findUnique({ where: { id } });
  }

  async findByStudentAndCourse(studentId: string, courseId: string) {
    return this.prisma.courseEnrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
  }

  async findMany(params: {
    skip: number;
    take: number;
    studentId?: string;
    courseId?: string;
  }) {
    const where: Prisma.CourseEnrollmentWhereInput = {
      deletedAt: null,
      ...(params.studentId ? { studentId: params.studentId } : {}),
      ...(params.courseId ? { courseId: params.courseId } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.courseEnrollment.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.courseEnrollment.count({ where }),
    ]);

    return { items, total };
  }

  async softDelete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.courseEnrollment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async reactivate(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.courseEnrollment.update({
      where: { id },
      data: { deletedAt: null, enrolledAt: new Date() },
    });
  }
}
