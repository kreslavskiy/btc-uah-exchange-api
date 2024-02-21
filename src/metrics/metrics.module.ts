import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { DbModule } from 'src/db/db.module';
import { MetricsController } from './metrics.controller';

@Module({
  exports: [MetricsService],
  providers: [MetricsService],
  controllers: [MetricsController],
  imports: [
    DbModule,
    PrometheusModule.register({
      pushgateway: {
        url: process.env.PUSHGATEWAY_URL,
      },
    }),
  ],
})
export class MetricsModule {}
