import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { SetPasswordDto } from "../dto/set-password.dto";
import { LoginDto } from "../dto/login.dto";
import { RefreshTokenDto } from "../dto/refresh-token.dto";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { CurrentUser } from "../decorators/current-user.decorator";
import { AuthenticatedUser } from "../entities/authenticated-user.entity";
import { Role } from "../../generated/prisma/client";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body() dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(dto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }

  @Get("student")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  student(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }

  @Get("teacher")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  teacher(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }

  @Get("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  admin(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }

  @Post("set-password")
  async setPassword(@Body() dto: SetPasswordDto): Promise<void> {
    return this.authService.setPassword(dto);
  }

  @Post("reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(dto);
  }

  @Post("forgot-password")
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(dto);
  }

  @Post("refresh")
  async refresh(
    @Body() dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshToken(dto);
  }

  @Post("logout")
  async logout(@Body() dto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(dto);
  }
}
