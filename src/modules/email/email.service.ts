import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailOptions, EmailResponse, IEmailService } from './interfaces/email.interface';

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
  }

  async send(options: EmailOptions): Promise<EmailResponse> {
    try {
      this.logger.log(`Sending email to ${options.to} with subject: ${options.subject}`);

      const { data, error } = await this.resend.emails.send({
        from: this.configService.getOrThrow<string>('RESEND_EMAIL'),
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        this.logger.error('Failed to send email:', error);
        throw new Error(`Email sending failed: ${error.message || 'Unknown error'}`);
      }

      if (!data) {
        throw new Error('No response data received from email service');
      }

      this.logger.log(`Email sent successfully with ID: ${data.id}`);

      return {
        id: data.id,
        from: this.configService.getOrThrow<string>('RESEND_EMAIL'),
        to: options.to,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Email sending error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
