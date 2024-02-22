import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { RateModule } from './rate/rate.module';
import { EmailModule } from './email/email.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    DbModule,
    RateModule,
    EmailModule,
    MetricsModule,
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
