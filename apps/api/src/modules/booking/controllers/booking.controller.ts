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
import { BookingService } from "../services/booking.service";
import { CreateBookingDto } from "../dto/create-booking.dto";
import { UpdateBookingDto } from "../dto/update-booking.dto";
import { ListBookingsQueryDto } from "../dto/list-bookings-query.dto";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../../../auth/entities/authenticated-user.entity";
import { Role } from "../../../generated/prisma/client";

@Controller("bookings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(Role.ADMINISTRATOR, Role.TEACHER)
  async create(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(dto);
  }

  @Get()
  @Roles(Role.ADMINISTRATOR, Role.TEACHER, Role.STUDENT)
  async list(
    @Query() query: ListBookingsQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bookingService.listBookings(query, user);
  }

  @Get(":id")
  @Roles(Role.ADMINISTRATOR, Role.TEACHER, Role.STUDENT)
  async getOne(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bookingService.getBooking(id, user);
  }

  @Patch(":id")
  @Roles(Role.ADMINISTRATOR, Role.TEACHER)
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingService.updateBooking(id, dto);
  }
}
