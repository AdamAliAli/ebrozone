import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from "class-validator";
import {
  FileCategory,
  FileRelatedType,
} from "../../../generated/prisma/client";

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  publicId!: string;

  @IsString()
  @IsNotEmpty()
  secureUrl!: string;

  @IsString()
  @IsNotEmpty()
  originalFilename!: string;

  @IsString()
  @IsNotEmpty()
  format!: string;

  @IsInt()
  @IsPositive()
  bytes!: number;

  @IsEnum(FileCategory)
  category!: FileCategory;

  @IsOptional()
  @IsEnum(FileRelatedType)
  relatedType?: FileRelatedType;

  @IsOptional()
  @IsUUID()
  relatedId?: string;
}
