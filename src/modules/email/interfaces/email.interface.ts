export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface EmailResponse {
  id: string;
  from: string;
  to: string;
  created_at: string;
}

export interface IEmailService {
  send(options: EmailOptions): Promise<EmailResponse>;
}
