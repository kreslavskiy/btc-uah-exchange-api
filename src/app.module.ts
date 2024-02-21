import { Module } from '@nestjs/common';
import { RateModule } from './rate/rate.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { MetricsModule } from './metrics/metrics.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    DbModule,
    RateModule,
    EmailModule,
    MetricsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dist'],
    }),
  ],
})
export class AppModule {}
