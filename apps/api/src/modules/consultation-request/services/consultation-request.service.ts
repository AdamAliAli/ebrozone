import { Injectable, NotFoundException } from "@nestjs/common";
import { ConsultationRequestRepository } from "../repositories/consultation-request.repository";
import {
  ConsultationRequest,
  ConsultationRequestStatus,
} from "../../../generated/prisma/client";
import { CreateConsultationRequestDto } from "../dto/create-consultation-request.dto";
import { UpdateConsultationRequestDto } from "../dto/update-consultation-request.dto";
import { ListConsultationRequestsQueryDto } from "../dto/list-consultation-requests-query.dto";

export interface ConsultationRequestResponse {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  preferredContactTime: string | null;
  currentEnglishLevel: string | null;
  learningGoal: string | null;
  notes: string | null;
  status: ConsultationRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

@Injectable()
export class ConsultationRequestService {
  constructor(
    private readonly consultationRequestRepository: ConsultationRequestRepository,
  ) {}

  async createRequest(
    dto: CreateConsultationRequestDto,
  ): Promise<ConsultationRequestResponse> {
    const request = await this.consultationRequestRepository.create({
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email,
      preferredContactTime: dto.preferredContactTime,
      currentEnglishLevel: dto.currentEnglishLevel,
      learningGoal: dto.learningGoal,
      notes: dto.notes,
    });
    return toConsultationRequestResponse(request);
  }

  async listRequests(query: ListConsultationRequestsQueryDto): Promise<{
    items: ConsultationRequestResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    const { items, total } = await this.consultationRequestRepository.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: items.map(toConsultationRequestResponse),
      total,
      page,
      limit,
    };
  }

  async getRequest(id: string): Promise<ConsultationRequestResponse> {
    const request = await this.findRequestOrThrow(id);
    return toConsultationRequestResponse(request);
  }

  async updateRequest(
    id: string,
    dto: UpdateConsultationRequestDto,
  ): Promise<ConsultationRequestResponse> {
    await this.findRequestOrThrow(id);
    const updated = await this.consultationRequestRepository.update(id, {
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email,
      preferredContactTime: dto.preferredContactTime,
      currentEnglishLevel: dto.currentEnglishLevel,
      learningGoal: dto.learningGoal,
      notes: dto.notes,
      status: dto.status,
    });
    return toConsultationRequestResponse(updated);
  }

  private async findRequestOrThrow(id: string): Promise<ConsultationRequest> {
    const request = await this.consultationRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundException("Consultation request not found.");
    }
    return request;
  }
}

function toConsultationRequestResponse(
  request: ConsultationRequest,
): ConsultationRequestResponse {
  return {
    id: request.id,
    fullName: request.fullName,
    phone: request.phone,
    email: request.email,
    preferredContactTime: request.preferredContactTime,
    currentEnglishLevel: request.currentEnglishLevel,
    learningGoal: request.learningGoal,
    notes: request.notes,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
}
