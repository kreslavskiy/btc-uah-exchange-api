import { Injectable } from '@nestjs/common';
import { Email, Status } from '@prisma/client';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { EmailError } from '../email.error';
import { MailerEmailService } from './mailer-email.service';
import { EMAIL_CONSTANTS } from '../email.constants';
import { CURRENT_RATE_TEMPLATE } from '../templates/current-rate.template';
import { ISendCurrentRate } from '../interfaces/send-current-rate.interface';
import { formatRateWithThousandsSeparator } from '../utils/format-rate.util';
import { PrismaDBService } from '../../db/db.servise';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly prismaDbService: PrismaDBService,
    private readonly mailerService: MailerEmailService,
    @InjectPinoLogger(EmailService.name)
    private readonly logger: PinoLogger,
  ) {}

  public async findAll(): Promise<Email[]> {
    return this.prismaDbService.email.findMany();
  }

  public async create(email: string): Promise<Email> {
    const exists = await this.prismaDbService.email.findUnique({
      where: {
        email,
      },
    });

    if (exists) {
      this.logger.error(`Email ${email} exists`);

      throw EmailError.AlreadyExists();
    }

    const record = await this.prismaDbService.email.create({
      data: {
        email,
      },
    });

    this.metricsService.incrementSubscribtionCounter();

    return record;
  }

  public async delete(email: string): Promise<boolean> {
    const record = await this.prismaDbService.email.findUnique({
      where: {
        email,
      },
    });

    if (!record) {
      this.logger.error(`Email ${email} not found`);

      throw EmailError.NotFound();
    }

    await this.prismaDbService.email.update({
      where: {
        email,
      },
      data: {
        deletedAt: new Date(),
        status: Status.unsubscribed,
      },
    });

    this.metricsService.incrementUnsubscriptionCounter();

    return true;
  }

  public async sendCurrentRate(payload: ISendCurrentRate): Promise<void> {
    const record = await this.prismaDbService.email.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!record) {
      this.logger.error(`Email ${payload.email} not found`);

      throw EmailError.NotFound();
    }

    const html = CURRENT_RATE_TEMPLATE.replace(
      '{{RATE}}',
      formatRateWithThousandsSeparator(payload.rate),
    ).replace('{{CURRENT_DATE}}', payload.date.toString());

    try {
      await this.mailerService.send({
        to: payload.email,
        subject: EMAIL_CONSTANTS.DEFAULT_SUBJECT,
        message: (payload.message || EMAIL_CONSTANTS.DEFAULT_MESSAGE) + html,
      });

      this.logger.info(`Letter sent to ${payload.email}`);
    } catch (error) {
      this.metricsService.incrementSentEmailsErrorCounter();

      this.logger.error(`Error sending letter to ${payload.email}`);

      throw error;
    }

    this.metricsService.incrementSentEmailsCounter();
  }
}
