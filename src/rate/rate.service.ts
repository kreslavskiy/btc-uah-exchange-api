import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IRate } from './interfaces/rate.interface';
import { IGetExchangeRateResult } from './interfaces/get-exchange-rate-result.interface';
import { RATE_CONSTANTS } from './rate.constants';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/services/email.service';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class RateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly metricsService: MetricsService,
  ) {}

  public async getExchangeRate(): Promise<IRate> {
    const apiKey = this.configService.get<string>('API_KEY');

    const result = await firstValueFrom(
      this.httpService.get<IGetExchangeRateResult>(RATE_CONSTANTS.API_URL, {
        headers: {
          [RATE_CONSTANTS.API_HEADER_NAME]: apiKey,
        },
      }),
    );

    this.metricsService.setRate(result.data.rate);

    return { date: result.data.time, rate: result.data.rate };
  }

  public async sendCurrentRateEmail(
    emails: string[],
    message?: string,
  ): Promise<boolean> {
    const mailSendingPromises = [];
    const { date, rate } = await this.getExchangeRate();

    for (const email of emails) {
      mailSendingPromises.push(
        this.emailService.sendCurrentRate({
          rate,
          email,
          message,
          date: new Date(date),
        }),
      );
    }

    await Promise.all(mailSendingPromises);

    return true;
  }
}
