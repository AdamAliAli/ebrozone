import { Controller, Get, UseGuards } from "@nestjs/common";
import { DashboardService } from "../services/dashboard.service";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../../../auth/entities/authenticated-user.entity";
import { Role } from "../../../generated/prisma/client";

@Controller("dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("student")
  @Roles(Role.STUDENT)
  async student(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getStudentDashboard(user);
  }

  @Get("teacher")
  @Roles(Role.TEACHER, Role.ADMINISTRATOR)
  async teacher(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getTeacherDashboard(user);
  }

  @Get("admin")
  @Roles(Role.ADMINISTRATOR)
  async admin(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getAdminDashboard(user);
  }
}
