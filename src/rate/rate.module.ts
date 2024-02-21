import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { HttpModule } from '@nestjs/axios';
import { RateController } from './rate.controller';
import { EmailModule } from 'src/email/email.module';
import { MetricsModule } from 'src/metrics/metrics.module';

@Module({
  exports: [RateService],
  providers: [RateService],
  controllers: [RateController],
  imports: [HttpModule, EmailModule, MetricsModule],
})
export class RateModule {}
