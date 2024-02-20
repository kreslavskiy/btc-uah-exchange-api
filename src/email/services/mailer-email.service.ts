import { MailerService } from '@nestjs-modules/mailer';
import { ISendMail } from '../interfaces/send-mail.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerEmailService {
  constructor (private readonly mailerService: MailerService) {}

  public async send(payload: ISendMail): Promise<void> {
    await this.mailerService.sendMail({
      to: payload.to,
      html: payload.message,
      subject: payload.subject,
    });
  }
}