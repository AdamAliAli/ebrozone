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
import { LessonService } from "../services/lesson.service";
import { CreateLessonDto } from "../dto/create-lesson.dto";
import { UpdateLessonDto } from "../dto/update-lesson.dto";
import { ListLessonsQueryDto } from "../dto/list-lessons-query.dto";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../../../auth/entities/authenticated-user.entity";
import { Role } from "../../../generated/prisma/client";

@Controller("lessons")
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles(Role.ADMINISTRATOR, Role.TEACHER)
  async create(@Body() dto: CreateLessonDto) {
    return this.lessonService.createLesson(dto);
  }

  @Get()
  @Roles(Role.ADMINISTRATOR, Role.TEACHER, Role.STUDENT)
  async list(
    @Query() query: ListLessonsQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.lessonService.listLessons(query, user);
  }

  @Get(":id")
  @Roles(Role.ADMINISTRATOR, Role.TEACHER, Role.STUDENT)
  async getOne(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.lessonService.getLesson(id, user);
  }

  @Patch(":id")
  @Roles(Role.ADMINISTRATOR, Role.TEACHER)
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.lessonService.updateLesson(id, dto);
  }
}
