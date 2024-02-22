import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from '../email/services/email.service';
import { MetricsService } from '../metrics/metrics.service';
import { RateService } from '../rate/rate.service';
import { SCHEDULE_CONSTANTS } from './schedule.constants';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly rateService: RateService,
    private readonly emailService: EmailService,
    private readonly metricsServise: MetricsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async sendChangeRateEmail(): Promise<void> {
    const { rate, date } = await this.rateService.getExchangeRate();

    const previousRate = await this.metricsServise.getLastSentRate();

    if (
      Math.abs(rate - previousRate) > SCHEDULE_CONSTANTS.RATE_CHANGE_THRESHOLD
    ) {
      await this.metricsServise.setLastSentRate(rate);

      const emails = await this.emailService.findAll();

      const sendEmailsPromises: Promise<void>[] = [];

      for (const record of emails) {
        sendEmailsPromises.push(
          this.emailService.sendCurrentRate({
            rate,
            email: record.email,
            date: new Date(date),
            message: SCHEDULE_CONSTANTS.MESSAGE.SIGNIFICANT_RATE_CHANGE,
          }),
        );
      }

      await Promise.all(sendEmailsPromises);
    }
  }

  @Cron(SCHEDULE_CONSTANTS.CRON_EXPRESSION.EVERY_DAY_AT_9_30_AM, {
    timeZone: SCHEDULE_CONSTANTS.LOCAL_TIMEZONE,
  })
  public async sendCurrentRateEmail(): Promise<void> {
    const emails = await this.emailService.findAll();

    const { rate, date } = await this.rateService.getExchangeRate();

    const sendEmailsPromises: Promise<void>[] = [];

    for (const record of emails) {
      sendEmailsPromises.push(
        this.emailService.sendCurrentRate({
          rate,
          email: record.email,
          date: new Date(date),
          message: SCHEDULE_CONSTANTS.MESSAGE.EVERY_DAY_9_30_AM,
        }),
      );
    }

    await Promise.all(sendEmailsPromises);
  }
}
