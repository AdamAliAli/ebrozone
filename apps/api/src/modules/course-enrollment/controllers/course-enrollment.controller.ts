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
import { CourseEnrollmentService } from "../services/course-enrollment.service";
import { CreateEnrollmentDto } from "../dto/create-enrollment.dto";
import { ListEnrollmentsQueryDto } from "../dto/list-enrollments-query.dto";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { Role } from "../../../generated/prisma/client";

@Controller("course-enrollments")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMINISTRATOR)
export class CourseEnrollmentController {
  constructor(
    private readonly courseEnrollmentService: CourseEnrollmentService,
  ) {}

  @Post()
  async create(@Body() dto: CreateEnrollmentDto) {
    return this.courseEnrollmentService.createEnrollment(dto);
  }

  @Get()
  async list(@Query() query: ListEnrollmentsQueryDto) {
    return this.courseEnrollmentService.listEnrollments(query);
  }

  @Get(":id")
  async getOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.courseEnrollmentService.getEnrollment(id);
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.courseEnrollmentService.withdrawEnrollment(id);
  }

  @Post(":id/reactivate")
  async reactivate(@Param("id", ParseUUIDPipe) id: string) {
    return this.courseEnrollmentService.reactivateEnrollment(id);
  }
}
