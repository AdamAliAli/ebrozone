import { IsEnum, IsISO8601, IsOptional, IsString } from "class-validator";
import { BookingStatus } from "../../../generated/prisma/client";

export class UpdateBookingDto {
  @IsOptional()
  @IsISO8601()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  meetingLink?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
