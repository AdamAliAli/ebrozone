import { Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { BookingController } from "./controllers/booking.controller";
import { BookingService } from "./services/booking.service";
import { BookingRepository } from "./repositories/booking.repository";

@Module({
  imports: [AuthModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
})
export class BookingModule {}
