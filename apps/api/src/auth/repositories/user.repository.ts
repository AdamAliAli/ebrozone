import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, Role } from "../../generated/prisma/client";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(email: string, role: Role, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.user.create({ data: { email, role } });
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

  async findManyByRole(params: {
    role: Role;
    skip: number;
    take: number;
    search?: string;
  }) {
    const where: Prisma.UserWhereInput = {
      role: params.role,
      deletedAt: null,
      ...(params.search
        ? { email: { contains: params.search, mode: "insensitive" } }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total };
  }

  async countByRole(role: Role): Promise<number> {
    return this.prisma.user.count({ where: { role } });
  }

  async updateEmail(
    id: string,
    email: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.user.update({ where: { id }, data: { email } });
  }

  async softDelete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async reactivate(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.user.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
