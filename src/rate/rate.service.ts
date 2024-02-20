import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IRate } from './interfaces/rate.interface';
import { IGetExchangeRateResult } from './interfaces/get-exchange-rate-result.interface';
import { RATE_CONSTANTS } from './rate.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getExchangeRate(): Promise<IRate> {
    const apiKey = this.configService.get<string>('API_KEY');

    const result = await firstValueFrom(
      this.httpService.get<IGetExchangeRateResult>(RATE_CONSTANTS.API_URL, {
        headers: {
          [RATE_CONSTANTS.API_HEADER_NAME]: apiKey,
        },
      }),
    );

    return { date: result.data.time, rate: result.data.rate };
  }
}
