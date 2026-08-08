import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID } from "class-validator";
import { BookingType } from "../../../generated/prisma/client";

export class CreateBookingDto {
  @IsUUID()
  studentId!: string;

  @IsUUID()
  teacherId!: string;

  @IsEnum(BookingType)
  type!: BookingType;

  @IsISO8601()
  scheduledAt!: string;

  @IsOptional()
  @IsString()
  meetingLink?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
