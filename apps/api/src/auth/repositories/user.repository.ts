import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "../../generated/prisma/client";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async activatePassword(
    userId: string,
    passwordHash: string,
    verifyEmail: boolean,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        ...(verifyEmail ? { emailVerifiedAt: new Date() } : {}),
      },
    });
  }
}
