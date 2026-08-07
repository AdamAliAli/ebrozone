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
import { EnrollmentService } from "../services/enrollment.service";
import { CreateStudentDto } from "../dto/create-student.dto";
import { ListStudentsQueryDto } from "../dto/list-students-query.dto";
import { UpdateStudentDto } from "../dto/update-student.dto";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { Role } from "../../../generated/prisma/client";

@Controller("students")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMINISTRATOR)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  async createStudent(
    @Body() dto: CreateStudentDto,
  ): Promise<{ id: string; email: string }> {
    return this.enrollmentService.createStudent(dto);
  }

  @Get()
  async list(@Query() query: ListStudentsQueryDto) {
    return this.enrollmentService.listStudents(query);
  }

  @Get(":id")
  async getOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.enrollmentService.getStudent(id);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.enrollmentService.updateStudent(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.enrollmentService.deleteStudent(id);
  }

  @Post(":id/reactivate")
  async reactivate(@Param("id", ParseUUIDPipe) id: string) {
    return this.enrollmentService.reactivateStudent(id);
  }
}
