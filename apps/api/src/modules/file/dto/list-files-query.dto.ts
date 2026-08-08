import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from "class-validator";
import {
  FileCategory,
  FileRelatedType,
} from "../../../generated/prisma/client";

export class ListFilesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsEnum(FileCategory)
  category?: FileCategory;

  @IsOptional()
  @IsEnum(FileRelatedType)
  relatedType?: FileRelatedType;

  @IsOptional()
  @IsUUID()
  relatedId?: string;
}
