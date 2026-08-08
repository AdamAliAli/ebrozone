import { IsEnum } from "class-validator";
import { FileCategory } from "../../../generated/prisma/client";

export class CreateUploadSignatureDto {
  @IsEnum(FileCategory)
  category!: FileCategory;
}
