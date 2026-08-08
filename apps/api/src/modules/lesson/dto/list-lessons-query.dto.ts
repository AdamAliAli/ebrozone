import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from "class-validator";
import { LessonStatus } from "../../../generated/prisma/client";

export class ListLessonsQueryDto {
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
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;
}
