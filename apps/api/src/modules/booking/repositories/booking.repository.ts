import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import {
  BookingStatus,
  BookingType,
  Prisma,
} from "../../../generated/prisma/client";

@Injectable()
export class BookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: {
      studentId: string;
      teacherId: string;
      type: BookingType;
      scheduledAt: Date;
      meetingLink?: string;
      notes?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.booking.create({ data });
  }

  async findById(id: string) {
    return this.prisma.booking.findUnique({ where: { id } });
  }

  async findMany(params: {
    skip: number;
    take: number;
    studentId?: string;
    teacherId?: string;
    status?: BookingStatus;
  }) {
    const where: Prisma.BookingWhereInput = {
      ...(params.studentId ? { studentId: params.studentId } : {}),
      ...(params.teacherId ? { teacherId: params.teacherId } : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { scheduledAt: "desc" },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { items, total };
  }

  async update(
    id: string,
    data: Prisma.BookingUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.booking.update({ where: { id }, data });
  }
}
