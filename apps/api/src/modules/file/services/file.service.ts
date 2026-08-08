import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import { FileRepository } from "../repositories/file.repository";
import { CloudinaryService } from "../../../cloudinary/cloudinary.service";
import { CourseRepository } from "../../courses/repositories/course.repository";
import { HomeworkService } from "../../homework/services/homework.service";
import { LessonService } from "../../lesson/services/lesson.service";
import { AuthenticatedUser } from "../../../auth/entities/authenticated-user.entity";
import {
  File,
  FileCategory,
  FileRelatedType,
  Role,
} from "../../../generated/prisma/client";
import { CreateUploadSignatureDto } from "../dto/create-upload-signature.dto";
import { CreateFileDto } from "../dto/create-file.dto";
import { ListFilesQueryDto } from "../dto/list-files-query.dto";

export interface FileResponse {
  id: string;
  uploaderId: string;
  category: FileCategory;
  originalFilename: string;
  storedFilename: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  cloudinaryPublicId: string;
  secureUrl: string;
  relatedType: FileRelatedType | null;
  relatedId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp"];
const SUPPORTED_FORMATS = [...IMAGE_FORMATS, "pdf"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_PDF_BYTES = 20 * 1024 * 1024;

const FORMAT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
};

const CATEGORY_FOLDERS: Record<FileCategory, string> = {
  HOMEWORK: "homework",
  LESSON_RESOURCE: "lesson-resources",
  STUDENT_UPLOAD: "student-uploads",
  COURSE_MATERIAL: "course-materials",
};

const CATEGORY_UPLOAD_ROLES: Record<FileCategory, Role[]> = {
  HOMEWORK: [Role.STUDENT, Role.TEACHER, Role.ADMINISTRATOR],
  LESSON_RESOURCE: [Role.TEACHER, Role.ADMINISTRATOR],
  COURSE_MATERIAL: [Role.TEACHER, Role.ADMINISTRATOR],
  STUDENT_UPLOAD: [Role.STUDENT, Role.ADMINISTRATOR],
};

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly courseRepository: CourseRepository,
    private readonly homeworkService: HomeworkService,
    private readonly lessonService: LessonService,
  ) {}

  createUploadSignature(
    dto: CreateUploadSignatureDto,
    currentUser: AuthenticatedUser,
  ) {
    this.assertCanUploadToCategory(dto.category, currentUser);

    const folder = CATEGORY_FOLDERS[dto.category];
    const publicId = `${folder}/${randomUUID()}`;
    const signature = this.cloudinaryService.signUploadParams({
      public_id: publicId,
      folder,
    });

    return { ...signature, publicId, folder };
  }

  async createFile(
    dto: CreateFileDto,
    currentUser: AuthenticatedUser,
  ): Promise<FileResponse> {
    this.assertCanUploadToCategory(dto.category, currentUser);

    const format = dto.format.toLowerCase();
    if (!SUPPORTED_FORMATS.includes(format)) {
      throw new BadRequestException("Unsupported file type.");
    }

    const isImage = IMAGE_FORMATS.includes(format);
    const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_PDF_BYTES;
    if (dto.bytes > maxBytes) {
      throw new BadRequestException(
        isImage
          ? "Image files must not exceed 10 MB."
          : "PDF files must not exceed 20 MB.",
      );
    }

    if (
      (dto.relatedType && !dto.relatedId) ||
      (!dto.relatedType && dto.relatedId)
    ) {
      throw new BadRequestException(
        "relatedType and relatedId must be provided together.",
      );
    }

    if (dto.relatedType && dto.relatedId) {
      await this.assertCanAccessRelatedResource(
        dto.relatedType,
        dto.relatedId,
        currentUser,
      );
    }

    const existing = await this.fileRepository.findByCloudinaryPublicId(
      dto.publicId,
    );
    if (existing) {
      throw new ConflictException("This file has already been recorded.");
    }

    const uuidSegment = dto.publicId.includes("/")
      ? dto.publicId.split("/").pop()!
      : dto.publicId;

    const file = await this.fileRepository.create({
      uploaderId: currentUser.id,
      category: dto.category,
      originalFilename: dto.originalFilename,
      storedFilename: `${uuidSegment}.${format}`,
      fileType: format,
      fileSize: dto.bytes,
      mimeType: FORMAT_TO_MIME[format]!,
      cloudinaryPublicId: dto.publicId,
      secureUrl: dto.secureUrl,
      relatedType: dto.relatedType,
      relatedId: dto.relatedId,
    });

    return toFileResponse(file);
  }

  async listFiles(
    query: ListFilesQueryDto,
    currentUser: AuthenticatedUser,
  ): Promise<{
    items: FileResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    if (
      (query.relatedType && !query.relatedId) ||
      (!query.relatedType && query.relatedId)
    ) {
      throw new BadRequestException(
        "relatedType and relatedId must be provided together.",
      );
    }

    let uploaderId: string | undefined;

    if (query.relatedType && query.relatedId) {
      await this.assertCanAccessRelatedResource(
        query.relatedType,
        query.relatedId,
        currentUser,
      );
    } else if (currentUser.role === Role.STUDENT) {
      uploaderId = currentUser.id;
    }

    const { items, total } = await this.fileRepository.findMany({
      skip: (page - 1) * limit,
      take: limit,
      uploaderId,
      category: query.category,
      relatedType: query.relatedType,
      relatedId: query.relatedId,
    });

    return {
      items: items.map(toFileResponse),
      total,
      page,
      limit,
    };
  }

  async getFile(
    id: string,
    currentUser: AuthenticatedUser,
  ): Promise<FileResponse> {
    const file = await this.findFileOrThrow(id);

    if (currentUser.role === Role.STUDENT) {
      const isOwnUpload = file.uploaderId === currentUser.id;
      if (!isOwnUpload) {
        if (!file.relatedType || !file.relatedId) {
          throw new ForbiddenException("You do not have access to this file.");
        }
        await this.assertCanAccessRelatedResource(
          file.relatedType,
          file.relatedId,
          currentUser,
        );
      }
    }

    return toFileResponse(file);
  }

  async deleteFile(id: string): Promise<void> {
    const file = await this.findFileOrThrow(id);

    const resourceType = IMAGE_FORMATS.includes(file.fileType)
      ? "image"
      : "raw";
    await this.cloudinaryService.destroyAsset(
      file.cloudinaryPublicId,
      resourceType,
    );

    await this.fileRepository.delete(id);
  }

  private assertCanUploadToCategory(
    category: FileCategory,
    currentUser: AuthenticatedUser,
  ): void {
    if (!CATEGORY_UPLOAD_ROLES[category].includes(currentUser.role)) {
      throw new ForbiddenException(
        "You are not permitted to upload files in this category.",
      );
    }
  }

  private async assertCanAccessRelatedResource(
    relatedType: FileRelatedType,
    relatedId: string,
    currentUser: AuthenticatedUser,
  ): Promise<void> {
    switch (relatedType) {
      case FileRelatedType.HOMEWORK:
        await this.homeworkService.getHomework(relatedId, currentUser);
        return;
      case FileRelatedType.LESSON:
        await this.lessonService.getLesson(relatedId, currentUser);
        return;
      case FileRelatedType.COURSE: {
        const course = await this.courseRepository.findById(relatedId);
        if (!course) {
          throw new NotFoundException("Course not found.");
        }
        return;
      }
    }
  }

  private async findFileOrThrow(id: string): Promise<File> {
    const file = await this.fileRepository.findById(id);
    if (!file) {
      throw new NotFoundException("File not found.");
    }
    return file;
  }
}

function toFileResponse(file: File): FileResponse {
  return {
    id: file.id,
    uploaderId: file.uploaderId,
    category: file.category,
    originalFilename: file.originalFilename,
    storedFilename: file.storedFilename,
    fileType: file.fileType,
    fileSize: file.fileSize,
    mimeType: file.mimeType,
    cloudinaryPublicId: file.cloudinaryPublicId,
    secureUrl: file.secureUrl,
    relatedType: file.relatedType,
    relatedId: file.relatedId,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  };
}
