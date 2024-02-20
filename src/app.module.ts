import { Module } from '@nestjs/common';
import { RateModule } from './rate/rate.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    RateModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dist'],
    }),
  ],
})
export class AppModule {}
