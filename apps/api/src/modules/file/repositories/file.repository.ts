import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import {
  FileCategory,
  FileRelatedType,
  Prisma,
} from "../../../generated/prisma/client";

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: {
      uploaderId: string;
      category: FileCategory;
      originalFilename: string;
      storedFilename: string;
      fileType: string;
      fileSize: number;
      mimeType: string;
      cloudinaryPublicId: string;
      secureUrl: string;
      relatedType?: FileRelatedType;
      relatedId?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.file.create({ data });
  }

  async findById(id: string) {
    return this.prisma.file.findUnique({ where: { id } });
  }

  async findByCloudinaryPublicId(cloudinaryPublicId: string) {
    return this.prisma.file.findUnique({ where: { cloudinaryPublicId } });
  }

  async findMany(params: {
    skip: number;
    take: number;
    uploaderId?: string;
    category?: FileCategory;
    relatedType?: FileRelatedType;
    relatedId?: string;
  }) {
    const where: Prisma.FileWhereInput = {
      ...(params.uploaderId ? { uploaderId: params.uploaderId } : {}),
      ...(params.category ? { category: params.category } : {}),
      ...(params.relatedType ? { relatedType: params.relatedType } : {}),
      ...(params.relatedId ? { relatedId: params.relatedId } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.file.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.file.count({ where }),
    ]);

    return { items, total };
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.file.delete({ where: { id } });
  }
}
