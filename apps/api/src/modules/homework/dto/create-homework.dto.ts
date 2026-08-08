import { IsISO8601, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateHomeworkDto {
  @IsUUID()
  lessonId!: string;

  @IsString()
  @IsNotEmpty()
  instructions!: string;

  @IsISO8601()
  dueDate!: string;
}
