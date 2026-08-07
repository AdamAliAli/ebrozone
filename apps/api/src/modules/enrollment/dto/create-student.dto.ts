import { IsEmail } from "class-validator";

export class CreateStudentDto {
  @IsEmail()
  email!: string;
}
