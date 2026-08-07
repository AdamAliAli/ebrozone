import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
