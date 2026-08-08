import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { LessonStatus } from "../../../generated/prisma/client";

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsISO8601()
  lessonDate?: string;

  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;
}
