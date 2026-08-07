import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthTokenType, Prisma } from "../../generated/prisma/client";

@Injectable()
export class AuthTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    tokenHash: string,
    type: AuthTokenType,
    expiresAt: Date,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.authToken.create({
      data: { userId, tokenHash, type, expiresAt },
    });
  }

  async findByTokenHash(tokenHash: string) {
    return this.prisma.authToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  }

  async markUsed(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.authToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async invalidateOutstanding(
    userId: string,
    type: AuthTokenType,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.authToken.updateMany({
      where: { userId, type, usedAt: null },
      data: { usedAt: new Date() },
    });
  }
}
