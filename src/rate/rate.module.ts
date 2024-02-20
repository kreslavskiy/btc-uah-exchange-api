import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { HttpModule } from '@nestjs/axios';
import { RateController } from './rate.controller';

@Module({
  imports: [HttpModule],
  exports: [RateService],
  providers: [RateService],
  controllers: [RateController],
})
export class RateModule {}
