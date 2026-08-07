import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { AuthTokenRepository } from "./repositories/auth-token.repository";
import { UserRepository } from "./repositories/user.repository";
import { RefreshTokenRepository } from "./repositories/refresh-token.repository";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RolesGuard } from "./guards/roles.guard";
import { EnvConfig } from "../config/env";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig, true>) => ({
        secret: configService.get("jwtSecret", { infer: true }),
        signOptions: { expiresIn: "15m" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthTokenRepository,
    UserRepository,
    RefreshTokenRepository,
    JwtStrategy,
    RolesGuard,
  ],
  exports: [AuthService, UserRepository],
})
export class AuthModule {}
