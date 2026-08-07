import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CoursesService } from "../services/courses.service";
import { CreateCourseDto } from "../dto/create-course.dto";
import { UpdateCourseDto } from "../dto/update-course.dto";
import { ListCoursesQueryDto } from "../dto/list-courses-query.dto";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { Role } from "../../../generated/prisma/client";

@Controller("courses")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMINISTRATOR)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @Get()
  async list(@Query() query: ListCoursesQueryDto) {
    return this.coursesService.listCourses(query);
  }

  @Get(":id")
  async getOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.coursesService.getCourse(id);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.coursesService.deleteCourse(id);
  }

  @Post(":id/publish")
  async publish(@Param("id", ParseUUIDPipe) id: string) {
    return this.coursesService.publishCourse(id);
  }

  @Post(":id/unpublish")
  async unpublish(@Param("id", ParseUUIDPipe) id: string) {
    return this.coursesService.unpublishCourse(id);
  }
}
