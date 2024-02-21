import { Injectable } from '@nestjs/common';
import { Counter, Gauge, register } from 'prom-client';
import { METRICS_CONSTANTS } from './metrics.constants';
import { PrismaDBService } from 'src/db/db.servise';
import { MetricsType } from '@prisma/client';
import { IMetrics } from './interfaces/metrics.interface';

@Injectable()
export class MetricsService {
  private subscriptionCounter: Counter<string>;

  private unsubscriptionCounter: Counter<string>;

  private sentEmailsCounter: Counter<string>;

  private sentEmailsErrorCounter: Counter<string>;

  private rateGauge: Gauge<string>;

  constructor(private readonly prismaDbService: PrismaDBService) {
    this.subscriptionCounter = new Counter({
      name: METRICS_CONSTANTS.COUNTERS.SUBSCRIPTION.NAME,
      help: METRICS_CONSTANTS.COUNTERS.SUBSCRIPTION.HELP,
    });

    this.unsubscriptionCounter = new Counter({
      name: METRICS_CONSTANTS.COUNTERS.UNSUBSCRIPTION.NAME,
      help: METRICS_CONSTANTS.COUNTERS.UNSUBSCRIPTION.HELP,
    });

    this.sentEmailsCounter = new Counter({
      name: METRICS_CONSTANTS.COUNTERS.SENT_EMAILS.NAME,
      help: METRICS_CONSTANTS.COUNTERS.SENT_EMAILS.HELP,
    });

    this.sentEmailsErrorCounter = new Counter({
      name: METRICS_CONSTANTS.COUNTERS.SENT_EMAILS_ERROR.NAME,
      help: METRICS_CONSTANTS.COUNTERS.SENT_EMAILS_ERROR.HELP,
    });

    this.rateGauge = new Gauge({
      name: METRICS_CONSTANTS.GAUGES.RATE.NAME,
      help: METRICS_CONSTANTS.GAUGES.RATE.HELP,
    });

    register.clear();
    register.setDefaultLabels({
      app: METRICS_CONSTANTS.DEFAULT_LABELS.APP,
    });

    register.registerMetric(this.subscriptionCounter);
    register.registerMetric(this.unsubscriptionCounter);
    register.registerMetric(this.sentEmailsCounter);
    register.registerMetric(this.sentEmailsErrorCounter);
    register.registerMetric(this.rateGauge);
  }

  public async incrementSubscribtionCounter(): Promise<void> {
    this.subscriptionCounter.inc();

    const currentCount = await this.prismaDbService.metrics.findUnique({
      where: {
        type: MetricsType.subscription_counter,
      },
    });

    await this.prismaDbService.metrics.update({
      data: {
        value: currentCount.value + 1,
      },
      where: {
        type: MetricsType.subscription_counter,
      },
    });
  }

  public async incrementUnsubscriptionCounter(): Promise<void> {
    this.unsubscriptionCounter.inc();

    const currentCount = await this.prismaDbService.metrics.findUnique({
      where: {
        type: MetricsType.unsubscription_counter,
      },
    });

    await this.prismaDbService.metrics.update({
      data: {
        value: currentCount.value + 1,
      },
      where: {
        type: MetricsType.unsubscription_counter,
      },
    });
  }

  public async incrementSentEmailsCounter(): Promise<void> {
    this.sentEmailsCounter.inc();

    const currentCount = await this.prismaDbService.metrics.findUnique({
      where: {
        type: MetricsType.sent_emails_counter,
      },
    });

    await this.prismaDbService.metrics.update({
      data: {
        value: currentCount.value + 1,
      },
      where: {
        type: MetricsType.sent_emails_counter,
      },
    });
  }

  public async incrementSentEmailsErrorCounter(): Promise<void> {
    this.sentEmailsErrorCounter.inc();

    const currentCount = await this.prismaDbService.metrics.findUnique({
      where: {
        type: MetricsType.sent_emails_error_counter,
      },
    });

    await this.prismaDbService.metrics.update({
      data: {
        value: currentCount.value + 1,
      },
      where: {
        type: MetricsType.sent_emails_error_counter,
      },
    });
  }

  public async setRate(rate: number): Promise<void> {
    this.rateGauge.set(rate);

    await this.prismaDbService.metrics.update({
      data: {
        value: rate,
      },
      where: {
        type: MetricsType.rate_gauge,
      },
    });
  }

  public async getRate(): Promise<number> {
    const gauge = await this.rateGauge.get();

    return gauge.values[0].value;
  }

  public async getAll(): Promise<IMetrics> {
    const metrics = await this.prismaDbService.metrics.findMany();

    const result: IMetrics = {
      rate_gauge: 0,
      sent_emails_counter: 0,
      subscription_counter: 0,
      unsubscription_counter: 0,
      sent_emails_error_counter: 0,
    };

    for (const metric of metrics) {
      result[metric.type] = metric.value;
    }

    return result;
  }
}
