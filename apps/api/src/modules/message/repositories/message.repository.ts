import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Prisma } from "../../../generated/prisma/client";

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: { senderId: string; recipientId: string; body: string },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.message.create({ data });
  }

  async findById(id: string) {
    return this.prisma.message.findUnique({ where: { id } });
  }

  async findMany(params: {
    skip: number;
    take: number;
    selfId?: string;
    withUserId?: string;
  }) {
    let where: Prisma.MessageWhereInput = { deletedAt: null };

    if (params.selfId && params.withUserId) {
      where = {
        ...where,
        OR: [
          { senderId: params.selfId, recipientId: params.withUserId },
          { senderId: params.withUserId, recipientId: params.selfId },
        ],
      };
    } else if (params.selfId) {
      where = {
        ...where,
        OR: [{ senderId: params.selfId }, { recipientId: params.selfId }],
      };
    } else if (params.withUserId) {
      where = {
        ...where,
        OR: [
          { senderId: params.withUserId },
          { recipientId: params.withUserId },
        ],
      };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.message.count({ where }),
    ]);

    return { items, total };
  }

  async markAsRead(
    ids: string[],
    readAt: Date,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.message.updateMany({
      where: { id: { in: ids } },
      data: { readAt },
    });
  }

  async softDelete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.message.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
