import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { RateModule } from 'src/rate/rate.module';
import { MetricsModule } from 'src/metrics/metrics.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  providers: [ScheduleService],
  imports: [RateModule, MetricsModule, EmailModule],
})
export class ScheduleModule {}
