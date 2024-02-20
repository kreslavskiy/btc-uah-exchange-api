import { Controller, Get } from '@nestjs/common';
import { RateService } from './rate/rate.service';
import { IRate } from './rate/interfaces/rate.interface';

@Controller()
export class AppController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getExchangeRate(): Promise<IRate> {
    return this.rateService.getExchangeRate();
  }
}
