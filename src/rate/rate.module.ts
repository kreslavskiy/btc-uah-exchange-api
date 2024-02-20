import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  exports: [RateService],
  providers: [RateService],
})
export class RateModule {}
