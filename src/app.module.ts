import { Module } from '@nestjs/common';
import { RateModule } from './rate/rate.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RateModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
