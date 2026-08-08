import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { FileService } from "../services/file.service";
import { CreateUploadSignatureDto } from "../dto/create-upload-signature.dto";
import { CreateFileDto } from "../dto/create-file.dto";
import { ListFilesQueryDto } from "../dto/list-files-query.dto";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../../../auth/entities/authenticated-user.entity";
import { Role } from "../../../generated/prisma/client";

@Controller("files")
@UseGuards(JwtAuthGuard, RolesGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post("signature")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMINISTRATOR)
  createUploadSignature(
    @Body() dto: CreateUploadSignatureDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.fileService.createUploadSignature(dto, user);
  }

  @Post()
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMINISTRATOR)
  async create(
    @Body() dto: CreateFileDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.fileService.createFile(dto, user);
  }

  @Get()
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMINISTRATOR)
  async list(
    @Query() query: ListFilesQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.fileService.listFiles(query, user);
  }

  @Get(":id")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMINISTRATOR)
  async getOne(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.fileService.getFile(id, user);
  }

  @Delete(":id")
  @Roles(Role.TEACHER, Role.ADMINISTRATOR)
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.fileService.deleteFile(id);
  }
}
