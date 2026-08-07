import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { EnvConfig } from "../../config/env";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { AuthenticatedUser } from "../entities/authenticated-user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<EnvConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("jwtSecret", { infer: true }),
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return { id: payload.sub, role: payload.role };
  }
}
