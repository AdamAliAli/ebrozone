import { Module } from "@nestjs/common";
import { ConsultationRequestController } from "./controllers/consultation-request.controller";
import { ConsultationRequestService } from "./services/consultation-request.service";
import { ConsultationRequestRepository } from "./repositories/consultation-request.repository";

@Module({
  controllers: [ConsultationRequestController],
  providers: [ConsultationRequestService, ConsultationRequestRepository],
  exports: [ConsultationRequestService],
})
export class ConsultationRequestModule {}
