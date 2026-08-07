import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Prisma } from "../../../generated/prisma/client";

@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    title: string,
    description: string | undefined,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.course.create({ data: { title, description } });
  }

  async findById(id: string) {
    return this.prisma.course.findUnique({ where: { id } });
  }

  async findMany(params: { skip: number; take: number; search?: string }) {
    const where: Prisma.CourseWhereInput = {
      deletedAt: null,
      ...(params.search
        ? { title: { contains: params.search, mode: "insensitive" } }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.course.count({ where }),
    ]);

    return { items, total };
  }

  async updateDetails(
    id: string,
    data: { title?: string; description?: string },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.course.update({ where: { id }, data });
  }

  async softDelete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async publish(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.course.update({
      where: { id },
      data: { publishedAt: new Date() },
    });
  }

  async unpublish(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.course.update({
      where: { id },
      data: { publishedAt: null },
    });
  }
}
