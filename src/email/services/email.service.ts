import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.servise';
import { Email, Status } from '@prisma/client';
import { EmailError } from '../email.error';
import { MailerEmailService } from './mailer-email.service';
import { EMAIL_CONSTANTS } from '../email.constants';
import { CURRENT_RATE_TEMPLATE } from '../templates/current-rate.template';
import { ISendCurrentRate } from '../interfaces/send-current-rate.interface';
import { formatRateWithThousandsSeparator } from '../utils/format-rate.util';

@Injectable()
export class EmailService {
  constructor (
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerEmailService,
  ) {}

  public async findAll(): Promise<Email[]> {
    return this.prismaService.email.findMany();
  }

  public async create(email: string): Promise<Email> {
    const exists = await this.prismaService.email.findUnique({
      where: {
        email,
      },
    });

    if (exists) {
      throw EmailError.AlreadyExists();
    }

    const record = await this.prismaService.email.create({
      data: {
        email,
      },
    });

    return record;
  }

  public async delete(email: string): Promise<boolean> {
    const record = await this.prismaService.email.findUnique({
      where: {
        email,
      },
    });

    if (!record) {
      throw EmailError.NotFound();
    }

    await this.prismaService.email.update({
      where: {
        email,
      },
      data: {
        deletedAt: new Date(),
        status: Status.unsubscribed,
      }
    });

    return true;
  }

  public async sendCurrentRate(payload: ISendCurrentRate): Promise<void> {
    const record = await this.prismaService.email.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!record) {
      throw EmailError.NotFound();
    }

    const html = CURRENT_RATE_TEMPLATE
      .replace('{{RATE}}', formatRateWithThousandsSeparator(payload.rate))
      .replace('{{CURRENT_DATE}}', payload.date.toString());

    await this.mailerService.send({
      to: payload.email,
      subject: EMAIL_CONSTANTS.DEFAULT_SUBJECT,
      message: (payload.message || EMAIL_CONSTANTS.DEFAULT_MESSAGE) + html,
    });
  }
}
