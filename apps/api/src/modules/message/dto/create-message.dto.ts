import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateMessageDto {
  @IsUUID()
  recipientId!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;
}
