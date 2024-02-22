import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule as CronModule } from '@nestjs/schedule';
import { DbModule } from './db/db.module';
import { RateModule } from './rate/rate.module';
import { EmailModule } from './email/email.module';
import { MetricsModule } from './metrics/metrics.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    DbModule,
    RateModule,
    EmailModule,
    MetricsModule,
    ScheduleModule,
    CronModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dist'],
    }),
  ],
})
export class AppModule {}
