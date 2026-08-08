import { Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { MessageController } from "./controllers/message.controller";
import { MessageService } from "./services/message.service";
import { MessageRepository } from "./repositories/message.repository";

@Module({
  imports: [AuthModule],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
