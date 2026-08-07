import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { AuthService } from "../../../auth/services/auth.service";
import { UserRepository } from "../../../auth/repositories/user.repository";
import { Role, User } from "../../../generated/prisma/client";
import { CreateStudentDto } from "../dto/create-student.dto";
import { ListStudentsQueryDto } from "../dto/list-students-query.dto";
import { UpdateStudentDto } from "../dto/update-student.dto";

export interface StudentResponse {
  id: string;
  email: string;
  role: Role;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  async createStudent(
    dto: CreateStudentDto,
  ): Promise<{ id: string; email: string }> {
    return this.authService.issueActivation(dto.email, Role.STUDENT);
  }

  async listStudents(query: ListStudentsQueryDto): Promise<{
    items: StudentResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    const { items, total } = await this.userRepository.findManyByRole({
      role: Role.STUDENT,
      skip: (page - 1) * limit,
      take: limit,
      search: query.search,
    });

    return {
      items: items.map(toStudentResponse),
      total,
      page,
      limit,
    };
  }

  async getStudent(id: string): Promise<StudentResponse> {
    const user = await this.findStudentOrThrow(id);
    return toStudentResponse(user);
  }

  async updateStudent(
    id: string,
    dto: UpdateStudentDto,
  ): Promise<StudentResponse> {
    await this.findStudentOrThrow(id);

    if (!dto.email) {
      return toStudentResponse(await this.findStudentOrThrow(id));
    }

    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing && existing.id !== id) {
      throw new ConflictException("A user with this email already exists.");
    }

    const updated = await this.userRepository.updateEmail(id, dto.email);
    return toStudentResponse(updated);
  }

  async deleteStudent(id: string): Promise<void> {
    await this.findStudentOrThrow(id);
    await this.userRepository.softDelete(id);
  }

  async reactivateStudent(id: string): Promise<StudentResponse> {
    await this.findStudentOrThrow(id);
    const updated = await this.userRepository.reactivate(id);
    return toStudentResponse(updated);
  }

  private async findStudentOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user || user.role !== Role.STUDENT) {
      throw new NotFoundException("Student not found.");
    }
    return user;
  }
}

function toStudentResponse(user: User): StudentResponse {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
}
