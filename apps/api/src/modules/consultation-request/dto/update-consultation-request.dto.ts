import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ConsultationRequestStatus } from "../../../generated/prisma/client";

export class UpdateConsultationRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

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

  @IsOptional()
  @IsEnum(ConsultationRequestStatus)
  status?: ConsultationRequestStatus;
}
