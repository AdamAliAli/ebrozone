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
import { ConsultationRequestService } from "../services/consultation-request.service";
import { CreateConsultationRequestDto } from "../dto/create-consultation-request.dto";
import { UpdateConsultationRequestDto } from "../dto/update-consultation-request.dto";
import { ListConsultationRequestsQueryDto } from "../dto/list-consultation-requests-query.dto";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { Role } from "../../../generated/prisma/client";

@Controller("consultation-requests")
export class ConsultationRequestController {
  constructor(
    private readonly consultationRequestService: ConsultationRequestService,
  ) {}

  @Post()
  async create(@Body() dto: CreateConsultationRequestDto) {
    return this.consultationRequestService.createRequest(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  async list(@Query() query: ListConsultationRequestsQueryDto) {
    return this.consultationRequestService.listRequests(query);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  async getOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.consultationRequestService.getRequest(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateConsultationRequestDto,
  ) {
    return this.consultationRequestService.updateRequest(id, dto);
  }
}
