import { Module } from '@nestjs/common';
import { PrismaDBService } from './db.servise';

@Module({
  exports: [PrismaDBService],
  providers: [PrismaDBService],
})
export class DbModule {}
