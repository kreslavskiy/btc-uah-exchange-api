import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsResponse } from './responses/metrics.response';

@Controller('api/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  public async getAll(): Promise<any> {
    const metrics = await this.metricsService.getAll();

    return new MetricsResponse(metrics);
  }
}
