import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { HomeworkService } from "../services/homework.service";
import { CreateHomeworkDto } from "../dto/create-homework.dto";
import { UpdateHomeworkDto } from "../dto/update-homework.dto";
import { ListHomeworkQueryDto } from "../dto/list-homework-query.dto";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../../../auth/entities/authenticated-user.entity";
import { Role } from "../../../generated/prisma/client";

@Controller("homework")
@UseGuards(JwtAuthGuard, RolesGuard)
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @Roles(Role.ADMINISTRATOR, Role.TEACHER)
  async create(@Body() dto: CreateHomeworkDto) {
    return this.homeworkService.createHomework(dto);
  }

  @Get()
  @Roles(Role.ADMINISTRATOR, Role.TEACHER, Role.STUDENT)
  async list(
    @Query() query: ListHomeworkQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.homeworkService.listHomework(query, user);
  }

  @Get(":id")
  @Roles(Role.ADMINISTRATOR, Role.TEACHER, Role.STUDENT)
  async getOne(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.homeworkService.getHomework(id, user);
  }

  @Patch(":id")
  @Roles(Role.ADMINISTRATOR, Role.TEACHER)
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateHomeworkDto,
  ) {
    return this.homeworkService.updateHomework(id, dto);
  }
}
