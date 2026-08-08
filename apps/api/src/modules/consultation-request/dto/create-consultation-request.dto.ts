import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateConsultationRequestDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  preferredContactTime?: string;

  @IsOptional()
  @IsString()
  currentEnglishLevel?: string;

  @IsOptional()
  @IsString()
  learningGoal?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
