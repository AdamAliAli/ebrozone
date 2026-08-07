import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";
import { EnvConfig } from "../config/env";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resendClient: Resend | undefined;

  constructor(private readonly configService: ConfigService<EnvConfig, true>) {}

  async sendActivationEmail(
    email: string,
    activationUrl: string,
  ): Promise<void> {
    await this.send({
      to: email,
      subject: "Welcome to the Ebro Zone — Activate your account",
      html: `
        <p>Welcome to the Ebro Zone.</p>
        <p>You're safe here. Let's build your confidence together.</p>
        <p><a href="${activationUrl}">Activate your account</a></p>
        <p>This link expires in 7 days. If you didn't expect this email, you can ignore it.</p>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    await this.send({
      to: email,
      subject: "Reset your EbroZone password",
      html: `
        <p>We received a request to reset your password.</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
        <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      `,
    });
  }

  private getResendClient(): Resend {
    if (!this.resendClient) {
      this.resendClient = new Resend(
        this.configService.get("resendApiKey", { infer: true }),
      );
    }
    return this.resendClient;
  }

  private async send(params: SendEmailParams): Promise<void> {
    const from = this.configService.get("emailFrom", { infer: true });
    const { error } = await this.getResendClient().emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      this.logger.error(`Failed to send email to ${params.to}: ${error.message}`);
      throw new Error("Failed to send email.");
    }
  }
}
