import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import {
  HomeworkSubmissionStatus,
  Prisma,
} from "../../../generated/prisma/client";

@Injectable()
export class HomeworkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: {
      lessonId: string;
      instructions: string;
      dueDate: Date;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.homework.create({ data });
  }

  async findById(id: string) {
    return this.prisma.homework.findUnique({ where: { id } });
  }

  async findByIdWithLesson(id: string) {
    return this.prisma.homework.findUnique({
      where: { id },
      include: { lesson: true },
    });
  }

  async findMany(params: {
    skip: number;
    take: number;
    lessonId?: string;
    lessonIdIn?: string[];
    submissionStatus?: HomeworkSubmissionStatus;
  }) {
    const where: Prisma.HomeworkWhereInput = {
      ...(params.lessonId ? { lessonId: params.lessonId } : {}),
      ...(params.lessonIdIn ? { lessonId: { in: params.lessonIdIn } } : {}),
      ...(params.submissionStatus
        ? { submissionStatus: params.submissionStatus }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.homework.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { dueDate: "desc" },
      }),
      this.prisma.homework.count({ where }),
    ]);

    return { items, total };
  }

  async update(
    id: string,
    data: Prisma.HomeworkUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.homework.update({ where: { id }, data });
  }
}
