import { Injectable, NotFoundException } from "@nestjs/common";
import { MessageRepository } from "../repositories/message.repository";
import { UserRepository } from "../../../auth/repositories/user.repository";
import { AuthenticatedUser } from "../../../auth/entities/authenticated-user.entity";
import { Message, Role } from "../../../generated/prisma/client";
import { CreateMessageDto } from "../dto/create-message.dto";
import { ListMessagesQueryDto } from "../dto/list-messages-query.dto";

export interface MessageResponse {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const RECIPIENT_ROLE_BY_SENDER_ROLE: Partial<Record<Role, Role>> = {
  [Role.STUDENT]: Role.TEACHER,
  [Role.TEACHER]: Role.STUDENT,
};

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async sendMessage(
    dto: CreateMessageDto,
    currentUser: AuthenticatedUser,
  ): Promise<MessageResponse> {
    const expectedRecipientRole =
      RECIPIENT_ROLE_BY_SENDER_ROLE[currentUser.role];

    const recipient = await this.userRepository.findById(dto.recipientId);
    if (!recipient || recipient.role !== expectedRecipientRole) {
      throw new NotFoundException("Recipient not found.");
    }

    const message = await this.messageRepository.create({
      senderId: currentUser.id,
      recipientId: dto.recipientId,
      body: dto.body,
    });
    return toMessageResponse(message);
  }

  async listMessages(
    query: ListMessagesQueryDto,
    currentUser: AuthenticatedUser,
  ): Promise<{
    items: MessageResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    const selfId =
      currentUser.role === Role.ADMINISTRATOR ? undefined : currentUser.id;

    const { items, total } = await this.messageRepository.findMany({
      skip: (page - 1) * limit,
      take: limit,
      selfId,
      withUserId: query.withUserId,
    });

    const idsToMarkRead = items
      .filter(
        (message) =>
          message.recipientId === currentUser.id && !message.readAt,
      )
      .map((message) => message.id);

    const readAt = new Date();
    if (idsToMarkRead.length > 0) {
      await this.messageRepository.markAsRead(idsToMarkRead, readAt);
    }

    return {
      items: items.map((message) =>
        toMessageResponse(
          idsToMarkRead.includes(message.id)
            ? { ...message, readAt }
            : message,
        ),
      ),
      total,
      page,
      limit,
    };
  }

  async deleteMessage(id: string): Promise<void> {
    const message = await this.messageRepository.findById(id);
    if (!message) {
      throw new NotFoundException("Message not found.");
    }
    await this.messageRepository.softDelete(id);
  }
}

function toMessageResponse(message: Message): MessageResponse {
  return {
    id: message.id,
    senderId: message.senderId,
    recipientId: message.recipientId,
    body: message.body,
    readAt: message.readAt,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}
