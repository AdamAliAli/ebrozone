import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import envConfig from "./config/env";
import { PrismaModule } from "./prisma/prisma.module";
import { EmailModule } from "./email/email.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    PrismaModule,
    EmailModule,
    AuthModule,
  ],
})
export class AppModule {}
