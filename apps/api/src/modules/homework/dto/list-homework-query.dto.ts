import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from "class-validator";
import { HomeworkSubmissionStatus } from "../../../generated/prisma/client";

export class ListHomeworkQueryDto {
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
  lessonId?: string;

  @IsOptional()
  @IsEnum(HomeworkSubmissionStatus)
  submissionStatus?: HomeworkSubmissionStatus;
}
