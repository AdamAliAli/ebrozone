import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BookingRepository } from "../repositories/booking.repository";
import { UserRepository } from "../../../auth/repositories/user.repository";
import { AuthenticatedUser } from "../../../auth/entities/authenticated-user.entity";
import {
  Booking,
  BookingStatus,
  BookingType,
  Role,
} from "../../../generated/prisma/client";
import { CreateBookingDto } from "../dto/create-booking.dto";
import { UpdateBookingDto } from "../dto/update-booking.dto";
import { ListBookingsQueryDto } from "../dto/list-bookings-query.dto";

export interface BookingResponse {
  id: string;
  studentId: string;
  teacherId: string;
  type: BookingType;
  scheduledAt: Date;
  status: BookingStatus;
  meetingLink: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createBooking(dto: CreateBookingDto): Promise<BookingResponse> {
    const student = await this.userRepository.findById(dto.studentId);
    if (!student || student.role !== Role.STUDENT) {
      throw new NotFoundException("Student not found.");
    }

    const teacher = await this.userRepository.findById(dto.teacherId);
    if (!teacher || teacher.role !== Role.TEACHER) {
      throw new NotFoundException("Teacher not found.");
    }

    const booking = await this.bookingRepository.create({
      studentId: dto.studentId,
      teacherId: dto.teacherId,
      type: dto.type,
      scheduledAt: new Date(dto.scheduledAt),
      meetingLink: dto.meetingLink,
      notes: dto.notes,
    });
    return toBookingResponse(booking);
  }

  async listBookings(
    query: ListBookingsQueryDto,
    currentUser: AuthenticatedUser,
  ): Promise<{
    items: BookingResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    const studentId =
      currentUser.role === Role.STUDENT ? currentUser.id : query.studentId;

    const { items, total } = await this.bookingRepository.findMany({
      skip: (page - 1) * limit,
      take: limit,
      studentId,
      teacherId: query.teacherId,
      status: query.status,
    });

    return {
      items: items.map(toBookingResponse),
      total,
      page,
      limit,
    };
  }

  async getBooking(
    id: string,
    currentUser: AuthenticatedUser,
  ): Promise<BookingResponse> {
    const booking = await this.findBookingOrThrow(id);

    if (
      currentUser.role === Role.STUDENT &&
      booking.studentId !== currentUser.id
    ) {
      throw new ForbiddenException(
        "You do not have access to this booking.",
      );
    }

    return toBookingResponse(booking);
  }

  async updateBooking(
    id: string,
    dto: UpdateBookingDto,
  ): Promise<BookingResponse> {
    await this.findBookingOrThrow(id);
    const updated = await this.bookingRepository.update(id, {
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      status: dto.status,
      meetingLink: dto.meetingLink,
      notes: dto.notes,
    });
    return toBookingResponse(updated);
  }

  private async findBookingOrThrow(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException("Booking not found.");
    }
    return booking;
  }
}

function toBookingResponse(booking: Booking): BookingResponse {
  return {
    id: booking.id,
    studentId: booking.studentId,
    teacherId: booking.teacherId,
    type: booking.type,
    scheduledAt: booking.scheduledAt,
    status: booking.status,
    meetingLink: booking.meetingLink,
    notes: booking.notes,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}
