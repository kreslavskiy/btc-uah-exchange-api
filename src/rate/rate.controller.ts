import { Body, Controller, Get, Post } from '@nestjs/common';
import { RateService } from './rate.service';
import { GetExchangeRateResponse } from './responses/get-exchange-rate.response';
import { SendCurrentRateResponse } from './responses/send-current-rate.response';
import { SendCurrentRateSchema } from './schemas/send-current-rate.schema';

@Controller('api/rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  public async getExchangeRate(): Promise<GetExchangeRateResponse> {
    const rate = await this.rateService.getExchangeRate();

    return new GetExchangeRateResponse(rate);
  }

  @Post('subscription')
  public async sendCurrentRate(
    @Body() body: SendCurrentRateSchema,
  ): Promise<SendCurrentRateResponse> {
    const sent = await this.rateService.sendCurrentRateEmail(
      body.emails,
      body.message,
    );

    return new SendCurrentRateResponse(sent);
  }
}
