import {
  IsISO8601,
  IsNotEmpty,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsUUID()
  studentId!: string;

  @IsUUID()
  teacherId!: string;

  @IsUUID()
  bookingId!: string;

  @IsUUID()
  courseId!: string;

  @IsISO8601()
  lessonDate!: string;
}
