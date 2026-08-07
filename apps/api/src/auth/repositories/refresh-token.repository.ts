import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "../../generated/prisma/client";

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  async findByTokenHash(tokenHash: string) {
    return this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  }

  async revoke(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }
}
