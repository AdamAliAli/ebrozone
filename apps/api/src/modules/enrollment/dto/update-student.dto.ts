import { IsEmail, IsOptional } from "class-validator";

export class UpdateStudentDto {
  @IsOptional()
  @IsEmail()
  email?: string;
}
