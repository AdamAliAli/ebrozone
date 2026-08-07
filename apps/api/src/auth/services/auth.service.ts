import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthTokenType, Prisma, Role } from "../../generated/prisma/client";
import { AuthTokenRepository } from "../repositories/auth-token.repository";
import { UserRepository } from "../repositories/user.repository";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";
import { SetPasswordDto } from "../dto/set-password.dto";
import { LoginDto } from "../dto/login.dto";
import { RefreshTokenDto } from "../dto/refresh-token.dto";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { generateSecureToken, hashToken } from "../utils/token.util";
import { hashPassword, comparePassword } from "../utils/password.util";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { EmailService } from "../../email/email.service";
import { EnvConfig } from "../../config/env";

const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
const ACTIVATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authTokenRepository: AuthTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  async issueActivation(
    email: string,
    role: Role,
  ): Promise<{ id: string; email: string }> {
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new ConflictException("A user with this email already exists.");
    }

    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + ACTIVATION_TTL_MS);

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await this.userRepository.create(email, role, tx);
      await this.authTokenRepository.create(
        created.id,
        tokenHash,
        AuthTokenType.ACTIVATION,
        expiresAt,
        tx,
      );
      return created;
    });

    const frontendUrl = this.configService.get("frontendUrl", {
      infer: true,
    });
    const activationUrl = `${frontendUrl}/activate-account?token=${rawToken}`;
    await this.emailService.sendActivationEmail(user.email, activationUrl);

    return { id: user.id, email: user.email };
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user || user.deletedAt !== null || user.passwordHash === null) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const isPasswordValid = await comparePassword(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const accessToken = await this.signAccessToken(user.id, user.role);
    const refreshToken = await this.issueRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async setPassword(dto: SetPasswordDto): Promise<void> {
    const tokenHash = hashToken(dto.token);
    const authToken =
      await this.authTokenRepository.findByTokenHash(tokenHash);

    if (
      !authToken ||
      authToken.usedAt !== null ||
      authToken.expiresAt.getTime() <= Date.now() ||
      authToken.user.deletedAt !== null
    ) {
      throw new UnauthorizedException("This link is invalid or has expired.");
    }

    const passwordHash = await hashPassword(dto.password);

    await this.prisma.$transaction(async (tx) => {
      await this.userRepository.activatePassword(
        authToken.userId,
        passwordHash,
        authToken.type === AuthTokenType.ACTIVATION,
        tx,
      );
      await this.authTokenRepository.markUsed(authToken.id, tx);
    });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const tokenHash = hashToken(dto.token);
    const authToken =
      await this.authTokenRepository.findByTokenHash(tokenHash);

    if (
      !authToken ||
      authToken.type !== AuthTokenType.PASSWORD_RESET ||
      authToken.usedAt !== null ||
      authToken.expiresAt.getTime() <= Date.now() ||
      authToken.user.deletedAt !== null
    ) {
      throw new UnauthorizedException("This link is invalid or has expired.");
    }

    const passwordHash = await hashPassword(dto.password);

    await this.prisma.$transaction(async (tx) => {
      await this.userRepository.activatePassword(
        authToken.userId,
        passwordHash,
        false,
        tx,
      );
      await this.authTokenRepository.markUsed(authToken.id, tx);
    });
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user || user.deletedAt !== null || user.passwordHash === null) {
      return;
    }

    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

    await this.prisma.$transaction(async (tx) => {
      await this.authTokenRepository.invalidateOutstanding(
        user.id,
        AuthTokenType.PASSWORD_RESET,
        tx,
      );
      await this.authTokenRepository.create(
        user.id,
        tokenHash,
        AuthTokenType.PASSWORD_RESET,
        expiresAt,
        tx,
      );
    });

    const frontendUrl = this.configService.get("frontendUrl", {
      infer: true,
    });
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
    await this.emailService.sendPasswordResetEmail(user.email, resetUrl);
  }

  async refreshToken(dto: RefreshTokenDto): Promise<AuthTokens> {
    const tokenHash = hashToken(dto.refreshToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(
      tokenHash,
    );

    if (
      !stored ||
      stored.revokedAt !== null ||
      stored.expiresAt.getTime() <= Date.now() ||
      stored.user.deletedAt !== null
    ) {
      throw new UnauthorizedException("Invalid refresh token.");
    }

    const accessToken = await this.signAccessToken(
      stored.userId,
      stored.user.role,
    );

    let refreshToken = "";
    await this.prisma.$transaction(async (tx) => {
      await this.refreshTokenRepository.revoke(stored.id, tx);
      refreshToken = await this.issueRefreshToken(stored.userId, tx);
    });

    return { accessToken, refreshToken };
  }

  async logout(dto: RefreshTokenDto): Promise<void> {
    const tokenHash = hashToken(dto.refreshToken);
    const stored =
      await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (stored && stored.revokedAt === null) {
      await this.refreshTokenRepository.revoke(stored.id);
    }
  }

  private async signAccessToken(
    userId: string,
    role: Role,
  ): Promise<string> {
    const payload: JwtPayload = { sub: userId, role };
    return this.jwtService.signAsync(payload);
  }

  private async issueRefreshToken(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<string> {
    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await this.refreshTokenRepository.create(
      userId,
      tokenHash,
      expiresAt,
      tx,
    );
    return rawToken;
  }
}
