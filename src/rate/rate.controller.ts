import { Controller, Get } from '@nestjs/common';
import { RateService } from './rate.service';
import { IRate } from './interfaces/rate.interface';
import { GetExchangeRateResponse } from './responses/get-exchange-rate.response';

@Controller('api/rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getExchangeRate(): Promise<GetExchangeRateResponse> {
    const rate = await this.rateService.getExchangeRate();

    return new GetExchangeRateResponse(rate);
  }
}