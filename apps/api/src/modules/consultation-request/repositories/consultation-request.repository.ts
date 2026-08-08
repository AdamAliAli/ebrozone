import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import {
  ConsultationRequestStatus,
  Prisma,
} from "../../../generated/prisma/client";

@Injectable()
export class ConsultationRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: {
      fullName: string;
      phone: string;
      email?: string;
      preferredContactTime?: string;
      currentEnglishLevel?: string;
      learningGoal?: string;
      notes?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.consultationRequest.create({ data });
  }

  async findById(id: string) {
    return this.prisma.consultationRequest.findUnique({ where: { id } });
  }

  async findMany(params: {
    skip: number;
    take: number;
    status?: ConsultationRequestStatus;
  }) {
    const where: Prisma.ConsultationRequestWhereInput = {
      ...(params.status ? { status: params.status } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.consultationRequest.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.consultationRequest.count({ where }),
    ]);

    return { items, total };
  }

  async update(
    id: string,
    data: Prisma.ConsultationRequestUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.consultationRequest.update({ where: { id }, data });
  }
}
