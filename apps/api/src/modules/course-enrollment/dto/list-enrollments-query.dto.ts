import { Type } from "class-transformer";
import { IsInt, IsOptional, IsUUID, Min } from "class-validator";

export class ListEnrollmentsQueryDto {
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
  courseId?: string;
}
