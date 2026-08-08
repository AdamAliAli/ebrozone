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
import { MessageService } from "../services/message.service";
import { CreateMessageDto } from "../dto/create-message.dto";
import { ListMessagesQueryDto } from "../dto/list-messages-query.dto";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../../../auth/entities/authenticated-user.entity";
import { Role } from "../../../generated/prisma/client";

@Controller("messages")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @Roles(Role.STUDENT, Role.TEACHER)
  async create(
    @Body() dto: CreateMessageDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.messageService.sendMessage(dto, user);
  }

  @Get()
  @Roles(Role.ADMINISTRATOR, Role.TEACHER, Role.STUDENT)
  async list(
    @Query() query: ListMessagesQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.messageService.listMessages(query, user);
  }

  @Delete(":id")
  @Roles(Role.ADMINISTRATOR)
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.messageService.deleteMessage(id);
  }
}
