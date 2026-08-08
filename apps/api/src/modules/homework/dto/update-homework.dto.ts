import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { HomeworkSubmissionStatus } from "../../../generated/prisma/client";

export class UpdateHomeworkDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  instructions?: string;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;

  @IsOptional()
  @IsEnum(HomeworkSubmissionStatus)
  submissionStatus?: HomeworkSubmissionStatus;

  @IsOptional()
  @IsString()
  teacherFeedback?: string;
}
